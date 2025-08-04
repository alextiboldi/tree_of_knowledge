import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  try {
    // Get the current session to ensure parent is authenticated
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { domains } = await request.json();
    const { childId } = await params;

    // Validate required fields
    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return NextResponse.json(
        { error: "At least one domain must be selected" },
        { status: 400 }
      );
    }

    if (!childId) {
      return NextResponse.json(
        { error: "Child ID is required" },
        { status: 400 }
      );
    }

    // Verify that the child belongs to the authenticated parent
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId: session.user.id,
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: "Child not found or access denied" },
        { status: 404 }
      );
    }

    // Verify that all domain IDs exist
    const validDomains = await prisma.domain.findMany({
      where: {
        name: {
          in: domains,
        },
        isActive: true,
      },
    });

    if (validDomains.length !== domains.length) {
      return NextResponse.json(
        { error: "One or more invalid domains selected" },
        { status: 400 }
      );
    }

    // Remove existing domain selections for this child
    await prisma.childDomain.deleteMany({
      where: {
        childId: childId,
      },
    });

    // Create new domain selections
    const domainSelections = await prisma.childDomain.createMany({
      data: validDomains.map((domain) => ({
        childId: childId,
        domainId: domain.id,
      })),
    });

    // Mark parent's onboarding as complete since they've finished the full flow
    await prisma.parent.update({
      where: { id: session.user.id },
      data: { onboardingComplete: true },
    });

    // Get the child with updated domain selections
    const updatedChild = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        domains: {
          include: {
            domain: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Domain selections updated successfully",
        child: updatedChild,
        domainsSelected: domainSelections.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Domain selection error:", error);
    return NextResponse.json(
      { error: "Failed to update domain selections" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  try {
    // Get the current session to ensure parent is authenticated
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { childId } = await params;

    // Verify that the child belongs to the authenticated parent
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId: session.user.id,
      },
      include: {
        domains: {
          include: {
            domain: {
              select: {
                id: true,
                name: true,
                description: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: "Child not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      child,
      selectedDomains: child.domains.map((cd) => cd.domain.name),
    });
  } catch (error) {
    console.error("Get child domains error:", error);
    return NextResponse.json(
      { error: "Failed to fetch child domains" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get the current session to ensure parent is authenticated
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { displayName, age, parentalConsent } = await request.json();

    // Validate required fields
    if (!displayName || !age || !parentalConsent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate display name
    if (typeof displayName !== "string" || displayName.trim().length < 2) {
      return NextResponse.json(
        { error: "Display name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    if (displayName.trim().length > 20) {
      return NextResponse.json(
        { error: "Display name must be 20 characters or less" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z\s]+$/.test(displayName.trim())) {
      return NextResponse.json(
        { error: "Display name can only contain letters and spaces" },
        { status: 400 }
      );
    }

    // Validate age
    if (typeof age !== "number" || age < 5 || age > 15) {
      return NextResponse.json(
        { error: "Age must be between 5 and 15 years" },
        { status: 400 }
      );
    }

    // Validate parental consent
    if (parentalConsent !== true) {
      return NextResponse.json(
        { error: "Parental consent is required" },
        { status: 400 }
      );
    }

    // Check if parent exists in database
    const parent = await prisma.parent.findUnique({
      where: { id: session.user.id },
    });

    if (!parent) {
      return NextResponse.json(
        { error: "Parent account not found" },
        { status: 404 }
      );
    }

    // Create child profile
    const child = await prisma.child.create({
      data: {
        parentId: session.user.id,
        displayName: displayName.trim(),
        age: age,
      },
      select: {
        id: true,
        displayName: true,
        age: true,
        createdAt: true,
        parent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Child profile created successfully",
        child,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Child profile creation error:", error);
    return NextResponse.json(
      { error: "Failed to create child profile" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the current session to ensure parent is authenticated
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get all children for the authenticated parent
    const children = await prisma.child.findMany({
      where: {
        parentId: session.user.id,
      },
      select: {
        id: true,
        displayName: true,
        age: true,
        createdAt: true,
        updatedAt: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      onboardingComplete: session.user.onboardingComplete ?? false,
      children,
    });
  } catch (error) {
    console.error("Get children error:", error);
    return NextResponse.json(
      { error: "Failed to fetch children" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

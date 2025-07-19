#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

console.log("🌳 Tree of Knowledge - Environment Setup");
console.log("=========================================\n");

// Check if .env.local already exists
const envPath = path.join(process.cwd(), ".env.local");
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log(
    "⚠️  .env.local already exists. Please review your environment variables manually."
  );
  console.log("Required variables for NextAuth.js:");
  console.log("- NEXTAUTH_SECRET (should be a secure random string)");
  console.log(
    "- NEXTAUTH_URL (should be http://localhost:3000 for development)"
  );
  console.log("\nTo generate a new secret, run: openssl rand -base64 32\n");
  process.exit(0);
}

// Generate a secure secret
const secret = crypto.randomBytes(32).toString("base64");

// Template for .env.local
const envTemplate = `# NextAuth.js Configuration
NEXTAUTH_SECRET=${secret}
NEXTAUTH_URL=http://localhost:3000

# Database Configuration
# DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Development Settings
NODE_ENV=development

# Google Gemini AI Configuration
# GEMINI_API_KEY=your-gemini-api-key

# Optional: For enhanced debugging in development
# NEXTAUTH_DEBUG=true
`;

try {
  fs.writeFileSync(envPath, envTemplate);
  console.log("✅ Created .env.local with the following configuration:");
  console.log("   - NEXTAUTH_SECRET: Generated secure random secret");
  console.log("   - NEXTAUTH_URL: http://localhost:3000");
  console.log(
    "\n⚠️  Important: Make sure to update DATABASE_URL with your actual database connection string"
  );
  console.log(
    "⚠️  Important: Add your GEMINI_API_KEY if not already configured"
  );
  console.log("\n🚀 You can now run: npm run dev");
} catch (error) {
  console.error("❌ Failed to create .env.local:", error.message);
  console.log(
    "\nPlease create .env.local manually with the following content:"
  );
  console.log(envTemplate);
}

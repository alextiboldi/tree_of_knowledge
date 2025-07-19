# Product Requirements Document: The Magical Knowledge Tree

**Version:** 1.0
**Date:** July 19, 2025
**Product Manager:** [Your Name/Team]
**Development Team:** [To be assigned]
**Design Team:** [To be assigned]

---

## 1. Introduction

### 1.1 Vision

To create an enchanting and safe AI-powered web application that fosters a lifelong love of learning in children aged 5-15 by providing engaging, age-appropriate answers to their educational questions, visually represented by a "Magical Knowledge Tree" that grows with their understanding.

### 1.2 Purpose

This document outlines the features, functionality, and technical requirements for the initial release (MVP) of the Magical Knowledge Tree web application. It serves as a guiding resource for the development, design, and QA teams, ensuring a shared understanding of the product goals and implementation steps.

## 2. Goals & Objectives (MVP)

- **Primary Goal:** Enable children to ask educational questions and receive child-friendly, AI-generated explanations accompanied by illustrative drawings.
- **Key Performance Indicators (KPIs):**
  - **User Engagement:** Average number of questions asked per child per session.
  - **Retention:** Percentage of children returning to the app daily/weekly.
  - **Parent Satisfaction:** Positive feedback on safety features and educational value.
  - **AI Guardrail Effectiveness:** Low instance of inappropriate questions/answers slipping through (measured by monitoring and user reports).
- **Non-Goals for MVP:**
  - Peer-to-peer interaction or social features.
  - Gamification elements beyond the growing tree visual (e.g., points, badges).
  - Advanced analytics for child learning patterns.
  - Multi-child profile management within a single parent account (MVP assumes one child profile per parent account for simplicity, though the architecture should allow for expansion).

## 3. Target Audience & Personas

- **Primary Users (Children):** Ages 5-15, curious, eager to learn, visually stimulated.
- **Secondary Users (Parents/Guardians):** Tech-literate, value education, concerned about online safety, seek controlled learning environments.

## 4. User Stories (Epics & Key User Journeys)

### 4.1 Parent User Stories

- **Onboarding & Setup:**
  - As a parent, I want to easily understand what the app offers so I can decide if it's right for my child.
  - As a parent, I want to create a secure parent account so I can manage my child's access.
  - As a parent, I want to create a child profile, including their name and age, so the content is tailored to them.
  - As a parent, I want to select specific educational domains for my child so I can control what they learn.
  - As a parent, I want to review and agree to privacy policies so I feel confident about my child's data.
- **Management & Oversight:**
  - As a parent, I want to access a secure dashboard to view and modify my child's settings (e.g., domains).
  - As a parent, I want to easily report any inappropriate content or behavior so the app remains safe.

### 4.2 Child User Stories

- **Asking Questions:**
  - As a child, I want to easily ask educational questions in natural language.
  - As a child, I want to see a clear and inviting input area for my questions.
- **Receiving Answers:**
  - As a child, I want to receive answers that are easy to understand and age-appropriate.
  - As a child, I want to see a beautiful, detailed drawing accompanying each answer.
  - As a child, I want to feel like a friendly creature from the Knowledge Tree is guiding my learning.
- **Visual Feedback:**
  - As a child, I want to see the Knowledge Tree visually "grow" when I learn something new in a specific domain.
  - As a child, I want the overall app environment to feel magical and engaging.

## 5. Functional Requirements (Features)

### 5.1 Onboarding & Account Management (Parent Focus)

- **FR1.1 Landing Page:**
  - Visual: Animated "Magical Knowledge Tree" central illustration.
  - Content: Headline, sub-headline, value proposition, primary CTA ("Start Their Learning Journey").
  - Optional: Short, skippable visual tour highlighting key features.
- **FR1.2 Parent Registration:**
  - Input fields: Email, Password (with confirmation), Parent Name.
  - Validation: Email format, password strength.
  - Legal: Clear links to Terms of Service and Privacy Policy; mandatory acceptance checkbox.
- **FR1.3 Child Profile Creation:**
  - Input fields: Child's Display Name (not full name), Child's Age (numerical input, slider or dropdown for age range).
  - Legal: Mandatory parental consent checkbox for child's use and data processing.
- **FR1.4 Domain Selection:**
  - UI: Interactive list of 7 core domains (Science & Technology, History & Cultures, Nature & Environment, Arts & Creativity, Language & Communication, Math & Logic, Life Skills & Well-being).
  - Functionality: Parents can toggle selection for each domain. Default behavior (all selected vs. none selected to start) to be defined during UX design.
- **FR1.5 Parent Dashboard:**
  - Access: Secured via parent login.
  - Functionality: View/edit child profile, modify selected domains.
  - Reporting: Option to "Report Issue/Inappropriate Content."

### 5.2 Core Learning Experience (Child Focus)

- **FR2.1 Question Input Interface:**
  - UI: Prominent text input field.
  - Placeholder text: "What do you want to learn today?"
  - Action: "Ask" button.
- **FR2.2 AI-Powered Answer Generation:**
  - Receive question from frontend.
  - **FR2.2.1 Input Guardrails:**
    - Keyword/Phrase Blacklisting: Identify and block inappropriate terms.
    - Sentiment Analysis: Detect negative/aggressive tone.
    - Topic Classification: Determine if question is educational and within allowed domains.
    - Response: For flagged questions, return a pre-defined child-friendly message: "That's not something our Knowledge Tree can help with right now. Please ask about educational topics!"
  - **FR2.2.2 AI Model Integration:**
    - Integrate with chosen AI API (e.g., Google Gemini, OpenAI GPT).
    - System Prompt Engineering: Embed strict child-friendly directives into AI prompt.
    - Instruct AI to provide both `explanation_text` and `drawing_suggestion` in structured format.
  - **FR2.2.3 Output Post-Processing:**
    - Scan AI-generated text for any residual inappropriate content.
    - Enforce length constraints for explanations.
    - Parse explanation text and drawing suggestion.
    - Select corresponding pre-generated drawing based on `drawing_suggestion`.
  - **FR2.2.4 Response Delivery:** Return formatted explanation text, drawing image URL, and identified domain/creature to frontend.
- **FR2.3 Answer Display Interface:**
  - UI: Overlay or pop-up displaying the answer.
  - Content: Child-friendly explanation, large, detailed illustration.
  - Visual: Brief animation of the subject-specific creature presenting the answer.
  - Action: Close button to return to the main tree view.
- **FR2.4 Knowledge Tree Visual Growth:**
  - When an answer is successfully received, the corresponding branch/twig on the main tree should visually grow/bloom.
  - Animation: Gentle, satisfying visual effect for growth.
  - Visual elements: New leaves, blossoms, or small illustrative icons appearing on the relevant domain branch.

## 6. Non-Functional Requirements

- **Performance:**
  - Fast load times for initial page and subsequent interactions (e.g., answers should appear within 2-3 seconds).
  - Smooth animations for tree growth and creature interactions.
  - Efficient AI API calls to minimize latency and cost.
- **Scalability:**
  - Ability to handle a growing number of concurrent users and AI requests.
  - Backend infrastructure (Next.js API Routes, database) should support horizontal scaling.
- **Security:**
  - Secure user authentication (password hashing, session management).
  - Protection against common web vulnerabilities (XSS, CSRF, Injection).
  - Secure storage and handling of AI API keys (environment variables, never client-side).
  - Robust input/output sanitization for all AI interactions.
  - Data Encryption: Data at rest and in transit.
- **Usability (UX):**
  - Intuitive and easy-to-navigate interface for children.
  - Clear, legible fonts and accessible color contrast.
  - Responsive design for various screen sizes (desktop, tablet, mobile).
  - Engaging and consistent visual style across the entire application.
- **Reliability:**
  - High uptime for the application.
  - Error handling for AI API failures or unexpected responses.
  - Graceful degradation in case of network issues.
- **Maintainability:**
  - Clean, well-documented code.
  - Modular architecture (components, services).
  - Automated testing where appropriate.
- **Compliance:**
  - Adherence to data privacy regulations for children (e.g., COPPA, GDPR-K).
  - Clear and transparent privacy policy and terms of service.

## 7. Technical Architecture (Next.js Focus)

- **Frontend/Backend Framework:** Next.js (React)
  - Utilize Next.js for both frontend UI (React components) and backend API routes.
  - Leverage Server-Side Rendering (SSR) or Static Site Generation (SSG) where appropriate for performance and SEO (e.g., landing page, static content).
  - Use React Context or a state management library (e.g., Zustand, Jotai, or even Redux if complexity grows) for global state.
- **AI Integration:**
  - **Provider:** Google Gemini API (preferred for its safety features and suitability for conversational AI). OpenAI GPT models are a strong alternative.
  - **Interaction:** Requests to AI API will be handled by Next.js API Routes to secure API keys and implement server-side guardrails.
  - **Guardrail Implementation:** Custom middleware or functions within API routes for input filtering, prompt engineering, and output post-processing.
- **Database:** PostgreSQL (SQL Database)
  - **Purpose:** Store parent accounts, child profiles, selected learning domains, and potentially a log of questions/answers (for debugging/monitoring, not necessarily displayed to users in MVP).
  - **ORM/Query Builder:** Prisma or Knex.js for database interactions from Next.js API Routes.
- **Drawing Library:**
  - **Storage:** Cloud storage (e.g., Vercel Blob, AWS S3, Google Cloud Storage) for pre-generated, high-resolution image files.
  - **Naming Convention:** Consistent naming convention for drawings to allow programmatic fetching based on AI's `drawing_suggestion`. (e.g., `science_solar_system.png`).
- **Hosting & Deployment:** Vercel (recommended for seamless Next.js deployment, serverless functions, and integrated CDN).
- **Authentication:** NextAuth.js or custom JWT-based authentication for parent login.
- **Styling:** Tailwind CSS or CSS Modules for efficient and maintainable styling.

## 8. Development Phases & Milestones (High-Level)

- **Phase 1: Foundation & Core AI (Weeks 1-4)**
  - Set up Next.js project, basic structure, Vercel deployment.
  - Implement parent registration and login.
  - Integrate chosen AI API (Gemini/OpenAI) via Next.js API routes.
  - Develop initial input/output guardrails (basic keyword filtering, system prompt).
  - Build basic question input and raw AI answer display (text only).
  - Establish database schema for users and domains.
- **Phase 2: Child Profile & Domain Control (Weeks 5-8)**
  - Implement child profile creation.
  - Develop parent dashboard with domain selection functionality (UI and database integration).
  - Refine AI prompt to utilize child's age for age-appropriate language.
- **Phase 3: Visuals & Enchantment (Weeks 9-12)**
  - Design and create initial set of 50-100 core educational drawings across domains.
  - Implement drawing fetching and display based on AI suggestion.
  - Develop core "Magical Knowledge Tree" UI (static branches).
  - Implement visual growth animation for branches/twigs upon learning.
  - Design and implement creature guides animations.
  - Develop landing page.
- **Phase 4: Refinement & Testing (Weeks 13-16)**
  - Comprehensive testing (functional, UI/UX, performance, security).
  - Iterative refinement of AI guardrails and prompt engineering based on testing feedback.
  - Performance optimizations.
  - Accessibility audit.
  - Finalize content for static pages (privacy policy, terms).
- **Phase 5: Launch & Post-Launch (Week 17 onwards)**
  - Deployment to production.
  - Establish monitoring and analytics.
  - Set up feedback channels for parents.
  - Plan for continuous iteration, adding more drawings, refining AI, and potentially new features.

## 9. Assumptions & Constraints

- **Assumptions:**
  - Access to an AI Large Language Model (LLM) API (e.g., Google Gemini or OpenAI) that can be reliably used for content generation.
  - Availability of skilled Next.js, React, and potentially Python/Node.js developers.
  - Budget allocated for AI API usage and cloud hosting.
  - Clear legal guidance on child data privacy (COPPA, GDPR-K) is available and adhered to.
- **Constraints:**
  - Initial focus is web-only (no native mobile apps in MVP).
  - Drawing generation will primarily rely on a pre-generated library for MVP.

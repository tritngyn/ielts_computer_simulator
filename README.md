# 🎓 IELTS Master Simulator (Computer-Delivered)

> **A high-performance, full-stack web application designed to replicate the authentic computer-delivered IELTS testing experience with modern cinematic UI.**

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## 📖 Overview

This project is a sophisticated **Full-stack IELTS Simulator** built to provide users with a seamless, lag-free test environment across all four skills: **Reading, Listening, Writing, and Speaking**. It goes beyond a standard quiz app by supporting complex, dynamic HTML parsing required for real-world IELTS question types (such as in-text Gap Filling, Matching Information, and True/False/Not Given), integrated audio players for Listening, and a fully responsive "Light Cinematic" minimalist UI.

## 🚀 Key Technical Achievements

This project was built with a strong focus on **performance optimization, complex state management, and modern React architectures**:

### 1. Advanced React Rendering & Native DOM Interop
- **Problem:** Frequent state updates from a 1-second ticking timer caused the entire test component to re-render, destroying the focus state of raw HTML input fields (Gap Fill) injected via `dangerouslySetInnerHTML`.
- **Solution:** Implemented strategic memoization using `React.memo` to freeze the raw HTML DOM nodes. Bridged the gap between React's synthetic event system and the browser's native DOM by attaching native `EventListener`s directly to dynamically generated elements. This guarantees 0 missed keystrokes and perfectly stable input focus during cascading timer re-renders.

### 2. Full-Stack Architecture & Auth
- Integrated **Supabase (PostgreSQL)** combined with **Prisma ORM** for structured, type-safe database migrations and robust data fetching.
- Engineered secure user authentication and session management using Supabase Auth and Next.js middleware, protecting test routes and user histories.

### 3. Robust State Management & Hydration Safety
- Utilized **Zustand** to handle deeply nested application state (user answers, active passages, ticking timers) without prop-drilling.
- Overcame Next.js strict **Hydration Mismatch** errors by employing reactive store subscriptions and macrotask queue deferral, ensuring seamless Server-Side Rendering (SSR) to Client-Side hydration.

### 4. Fully Responsive "Impeccable" UI
- Crafted a minimalist, distraction-free "Light Cinematic" interface leveraging Tailwind CSS and Framer Motion. 
- Implemented complex responsive layouts, including a dynamic Mobile Tab Switcher for the test-taking interface, ensuring a flawless experience on both desktop and mobile devices.

## 🌟 Core Features

- **Authentic Split-Screen UI:** Replicates the exact layout of the computer-delivered IELTS exam.
- **Comprehensive 4-Skill Support:** Reading, Listening (with synchronized audio), Writing, and Speaking modules.
- **Real-time Synchronization:** Answers are persisted instantly to global state.
- **Automated Grading:** Intelligent grading system that handles alternate correct answers and calculates final scores instantly upon submission.
- **History Tracking:** Personalized dashboard to review past attempts, scores, and completion times.

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React 18, TypeScript (Strict Mode)
- **Styling:** Tailwind CSS, Framer Motion (Micro-animations)
- **State Management:** Zustand
- **Backend & Database:** PostgreSQL hosted on Supabase, Prisma ORM
- **Deployment:** Vercel

## 💻 Running Locally

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   DATABASE_URL="your-supabase-connection-string"
   DIRECT_URL="your-supabase-direct-connection-string"
   ```
4. Run Prisma migrations:
   ```bash
   npx prisma db push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 🎯 Why This Project Matters
This application demonstrates the ability to solve non-trivial frontend and backend challenges—such as preventing React cascading renders, implementing secure auth flows, and managing complex DOM/State synchronization—skills that are critical for building scalable, high-performance web applications.

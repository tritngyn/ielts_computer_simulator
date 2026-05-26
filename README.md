# 🎓 IELTS Computer-Delivered Simulator

> **A high-performance, full-stack web application designed to replicate the authentic computer-delivered IELTS testing experience.**

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## 📖 Overview

This project is a sophisticated **IELTS Reading Simulator** built to provide users with a seamless, lag-free test environment. It goes beyond a standard quiz app by supporting complex, dynamic HTML parsing required for real-world IELTS question types (such as in-text Gap Filling, Matching Information, and True/False/Not Given), all while maintaining a strict 60-minute synchronized timer.

## 🚀 Key Technical Achievements

This project was built with a strong focus on **performance optimization, complex state management, and modern React architectures**, showcasing skills directly applicable to enterprise-level SaaS products:

### 1. Advanced React Rendering & Native DOM Interop
- **Problem:** Frequent state updates from a 1-second ticking timer caused the entire test component to re-render, destroying the focus state of raw HTML input fields (Gap Fill) injected via `dangerouslySetInnerHTML`.
- **Solution:** Implemented strategic memoization using `React.memo` to freeze the raw HTML DOM nodes. Bridged the gap between React's synthetic event system and the browser's native DOM by attaching native `EventListener`s directly to dynamically generated elements. This guarantees 0 missed keystrokes and perfectly stable input focus during cascading timer re-renders.

### 2. Robust State Management & Hydration Safety
- Utilized **Zustand** to handle deeply nested application state (user answers, active passages, ticking timers) without prop-drilling.
- Implemented `zustand/persist` for storing test history in `localStorage`. 
- Overcame Next.js / React 18+ strict **Hydration Mismatch** and "Synchronous setState" compiler errors by employing reactive store subscriptions and macrotask queue deferral (`setTimeout`), ensuring seamless Server-Side Rendering (SSR) to Client-Side hydration.

### 3. Complex Data Parsing Architecture
- Developed highly reliable Regex parsers to seamlessly transform raw HTML data (scraped from original Cambridge materials) into interactive React components on the fly, while strictly preserving original table/list formatting.

### 4. Database & ORM
- Integrated **Supabase (PostgreSQL)** combined with **Prisma ORM** for structured, type-safe database migrations and robust data fetching.

## 🌟 Core Features

- **Authentic Split-Screen UI:** Passage on the left, interactive questions on the right.
- **Support for All IELTS Formats:** Multiple Choice, Gap Fill (in-text inputs), Matching Headings, True/False/Not Given.
- **Real-time Synchronization:** Answers are persisted instantly to global state.
- **Automated Grading:** Intelligent grading system that handles alternate correct answers and calculates final scores instantly upon submission.
- **History Tracking:** Personalized dashboard to review past attempts, scores, and completion times.

## 🛠️ Tech Stack

- **Frontend Framework:** Next.js (App Router), React 18
- **Language:** TypeScript (Strict Mode)
- **Styling & UI:** Tailwind CSS, Framer Motion (Micro-animations)
- **State Management:** Zustand (with Persist Middleware)
- **Backend & DB:** PostgreSQL hosted on Supabase
- **ORM:** Prisma
- **Icons:** Lucide React

## 💻 Running Locally

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (create a `.env` file):
   ```env
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
This application demonstrates the ability to solve non-trivial frontend challenges—such as preventing React cascading renders, handling edge cases in SSR hydration, and managing complex DOM/State synchronization—skills that are critical for building scalable, high-performance web applications.

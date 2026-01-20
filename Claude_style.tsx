# IELTS Exam Interface - Comprehensive Style Guide

## Overview

This style guide documents the design system for an IELTS Reading test interface, specifically modeled after computer-based IELTS examinations. The interface follows a split-screen layout pattern commonly used in standardized testing platforms, prioritizing readability, accessibility, and functional clarity over decorative elements.

**Design Philosophy:**
- Clean, minimal aesthetic to reduce cognitive load during examination
- High contrast for extended reading sessions
- Clear information hierarchy
- Accessible and disability-friendly design
- Split-screen layout for simultaneous content viewing and question answering

---

## Color Palette

### Primary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Deep Charcoal** | `#2B2B2B` | rgb(43, 43, 43) | Primary text, headers |
| **Pure Black** | `#000000` | rgb(0, 0, 0) | Header bar, high-emphasis text |
| **Slate Gray** | `#4A4A4A` | rgb(74, 74, 74) | Secondary text, body copy |

### Background Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Pure White** | `#FFFFFF` | rgb(255, 255, 255) | Main content background, cards |
| **Light Gray** | `#F5F5F5` | rgb(245, 245, 245) | Secondary background, disabled states |
| **Cool Gray** | `#E8E8E8` | rgb(232, 232, 232) | Borders, dividers |
| **Pale Blue** | `#E6F3FF` | rgb(230, 243, 255) | Selected question highlight |

### Interactive Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Sky Blue** | `#00A6ED` | rgb(0, 166, 237) | Primary links, interactive elements |
| **Light Cyan** | `#B8E6FF` | rgb(184, 230, 255) | Hover state for questions |
| **Bright Blue** | `#0088CC` | rgb(0, 136, 204) | Active state, selected buttons |

### Status Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Success Green** | `#28A745` | rgb(40, 167, 69) | Correct answers (feedback mode) |
| **Warning Amber** | `#FFC107` | rgb(255, 193, 7) | Incomplete sections |
| **Error Red** | `#DC3545` | rgb(220, 53, 69) | Incorrect answers, warnings |
| **Info Blue** | `#17A2B8` | rgb(23, 162, 184) | Informational messages |

### Radio Button Colors

| State | Background | Border | Usage |
|-------|------------|--------|-------|
| **Unselected** | `#FFFFFF` | `#CCCCCC` | Default state |
| **Selected** | `#0088CC` | `#0088CC` | Active selection |
| **Hover** | `#F0F8FF` | `#00A6ED` | Hover state |

---

## Typography

### Font Families

**Primary Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

This system font stack ensures:
- Native appearance on each operating system
- Optimal rendering and readability
- Fast loading (no web font downloads)
- Excellent Unicode support for multilingual content

**Fallback for Special Characters:**
```css
font-family: 'Arial Unicode MS', sans-serif;
```

### Typography Scale

| Element | Size | Weight | Line Height | Letter Spacing | Usage |
|---------|------|--------|-------------|----------------|-------|
| **H1 - Main Title** | 24px | 700 (Bold) | 1.3 | -0.02em | Page title, section headers |
| **H2 - Section Title** | 20px | 700 (Bold) | 1.4 | -0.01em | "Part 1", content sections |
| **H3 - Subsection** | 18px | 600 (Semi-bold) | 1.4 | 0 | Question group headers |
| **Body - Primary** | 16px | 400 (Regular) | 1.6 | 0 | Reading passage text |
| **Body - Secondary** | 15px | 400 (Regular) | 1.5 | 0 | Question text |
| **Small Text** | 14px | 400 (Regular) | 1.5 | 0.01em | Instructions, metadata |
| **Caption** | 13px | 400 (Regular) | 1.4 | 0.02em | Timer, question numbers |
| **Label** | 12px | 500 (Medium) | 1.3 | 0.05em | Input labels, tags |

### Font Weight Usage

| Weight | Value | Usage Context |
|--------|-------|---------------|
| **Regular** | 400 | Body text, descriptions, reading passages |
| **Medium** | 500 | Input labels, subtle emphasis |
| **Semi-bold** | 600 | Subsection headers, important labels |
| **Bold** | 700 | Main headers, question numbers, CTAs |

### Text Styling Guidelines

**Reading Passage Text:**
- Font size: 16px
- Line height: 1.6 (25.6px)
- Color: #2B2B2B
- Max width: 720px (for optimal readability)
- Paragraph spacing: 16px bottom margin

**Question Text:**
- Font size: 15px
- Line height: 1.5
- Color: #4A4A4A
- Clear numbering with bold question numbers

**Instructions:**
- Font size: 14px
- Style: Italic for emphasis
- Color: #666666
- Often prefixed with icons or visual indicators

---

## Spacing System

The interface uses an 8px base unit spacing system for consistency and harmony.

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-xs` | 4px | Tight spacing, icon gaps |
| `spacing-sm` | 8px | Small gaps between related elements |
| `spacing-md` | 16px | Standard element spacing |
| `spacing-lg` | 24px | Section spacing |
| `spacing-xl` | 32px | Large section breaks |
| `spacing-2xl` | 48px | Major content divisions |
| `spacing-3xl` | 64px | Page-level spacing |

### Component-Specific Spacing

**Header Bar:**
- Height: 48px
- Horizontal padding: 16px
- Vertical padding: 12px
- Element spacing: 16px

**Content Containers:**
- Left panel padding: 24px
- Right panel padding: 20px
- Between columns gap: 24px

**Question List Items:**
- Padding: 12px 16px
- Gap between questions: 8px
- Margin bottom for groups: 16px

**Radio Buttons:**
- Label spacing: 8px
- Between options: 12px
- Indent from left: 24px

**Input Fields:**
- Padding: 8px 12px
- Label margin bottom: 6px
- Help text margin top: 4px

**Cards/Panels:**
- Padding: 20px 24px
- Inner element spacing: 16px
- Border radius: 4px

---

## Component Styles

### 1. Header Bar

```css
.header-bar {
  background: #000000;
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-title {
  font-size: 16px;
  font-weight: 600;
}

.timer {
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
```

**Visual Characteristics:**
- Solid black background for high contrast
- Fixed positioning at top
- Contains branding, test info, timer, and action buttons
- White text for maximum legibility

### 2. Split Layout Container

```css
.split-layout {
  display: grid;
  grid-template-columns: 1fr 480px;
  gap: 24px;
  height: calc(100vh - 48px);
  overflow: hidden;
}

.reading-panel {
  overflow-y: auto;
  padding: 24px;
  background: #FFFFFF;
}

.question-panel {
  overflow-y: auto;
  padding: 20px;
  background: #F5F5F5;
  border-left: 1px solid #E8E8E8;
}
```

**Layout Notes:**
- Left panel: Reading passage (flexible width)
- Right panel: Questions (fixed 480px width)
- Both panels independently scrollable
- Gap between panels: 24px

### 3. Reading Passage Section

```css
.reading-section {
  max-width: 720px;
  margin: 0 auto;
}

.section-header {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #2B2B2B;
  border-bottom: 2px solid #E8E8E8;
  padding-bottom: 8px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 12px;
  color: #2B2B2B;
}

.passage-text {
  font-size: 16px;
  line-height: 1.6;
  color: #2B2B2B;
  margin-bottom: 16px;
}

.passage-text p {
  margin-bottom: 16px;
}
```

### 4. Question Card

```css
.question-card {
  background: #FFFFFF;
  border: 1px solid #E8E8E8;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.question-card:hover {
  border-color: #00A6ED;
  box-shadow: 0 2px 8px rgba(0, 166, 237, 0.1);
}

.question-card.active {
  border-color: #0088CC;
  background: #E6F3FF;
  box-shadow: 0 2px 8px rgba(0, 136, 204, 0.15);
}

.question-number {
  font-size: 14px;
  font-weight: 700;
  color: #0088CC;
  margin-bottom: 8px;
}

.question-text {
  font-size: 15px;
  line-height: 1.5;
  color: #4A4A4A;
  margin-bottom: 12px;
}
```

### 5. Radio Button Group

```css
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 8px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.radio-option:hover {
  background: #F0F8FF;
}

.radio-input {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #CCCCCC;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-input:checked {
  border-color: #0088CC;
  background: #0088CC;
}

.radio-input:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: #FFFFFF;
  border-radius: 50%;
}

.radio-label {
  font-size: 15px;
  color: #2B2B2B;
  cursor: pointer;
  user-select: none;
}
```

### 6. Text Input Field

```css
.input-group {
  margin-bottom: 16px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: #4A4A4A;
  margin-bottom: 6px;
  display: block;
}

.text-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 15px;
  border: 2px solid #CCCCCC;
  border-radius: 4px;
  transition: all 0.2s ease;
  background: #FFFFFF;
}

.text-input:focus {
  outline: none;
  border-color: #0088CC;
  box-shadow: 0 0 0 3px rgba(0, 136, 204, 0.1);
}

.text-input::placeholder {
  color: #999999;
  font-style: italic;
}
```

### 7. Navigation Buttons

```css
.nav-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, 36px);
  gap: 8px;
  padding: 16px;
  background: #F5F5F5;
  border-radius: 4px;
}

.nav-button {
  width: 36px;
  height: 36px;
  border: 1px solid #CCCCCC;
  background: #FFFFFF;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #2B2B2B;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover {
  border-color: #0088CC;
  background: #E6F3FF;
}

.nav-button.active {
  background: #0088CC;
  color: #FFFFFF;
  border-color: #0088CC;
}

.nav-button.answered {
  background: #28A745;
  color: #FFFFFF;
  border-color: #28A745;
}
```

### 8. Instruction Box

```css
.instruction-box {
  background: #FFF9E6;
  border-left: 4px solid #FFC107;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 0 4px 4px 0;
}

.instruction-text {
  font-size: 14px;
  color: #4A4A4A;
  line-height: 1.5;
}

.instruction-text strong {
  font-weight: 700;
  color: #2B2B2B;
}
```

### 9. Action Buttons

```css
.button-primary {
  padding: 10px 20px;
  background: #0088CC;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-primary:hover {
  background: #006BA3;
  box-shadow: 0 2px 8px rgba(0, 136, 204, 0.3);
}

.button-secondary {
  padding: 10px 20px;
  background: #FFFFFF;
  color: #0088CC;
  border: 2px solid #0088CC;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-secondary:hover {
  background: #E6F3FF;
}
```

---

## Shadows & Elevation

The interface uses subtle shadows to create depth hierarchy without overwhelming the clean design.

### Shadow Scale

| Level | CSS Value | Usage |
|-------|-----------|-------|
| **None** | `none` | Flat elements, text |
| **Level 1** | `0 1px 2px rgba(0, 0, 0, 0.05)` | Input fields, subtle cards |
| **Level 2** | `0 2px 4px rgba(0, 0, 0, 0.1)` | Cards, panels, header |
| **Level 3** | `0 4px 8px rgba(0, 0, 0, 0.12)` | Dropdowns, modals |
| **Level 4** | `0 8px 16px rgba(0, 0, 0, 0.15)` | Overlays, popovers |
| **Interactive** | `0 2px 8px rgba(0, 136, 204, 0.2)` | Hover states, focus |

### Component Elevation

```css
.header-elevation {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-elevation {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.card-hover-elevation {
  box-shadow: 0 2px 8px rgba(0, 166, 237, 0.1);
}

.modal-elevation {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.focus-ring {
  box-shadow: 0 0 0 3px rgba(0, 136, 204, 0.1);
}
```

---

## Animations & Transitions

Animations are subtle and functional, enhancing usability without distracting from content.

### Transition Standards

```css
/* Standard transition for interactive elements */
.standard-transition {
  transition: all 0.2s ease;
}

/* Quick transition for hover states */
.quick-transition {
  transition: all 0.15s ease;
}

/* Slower transition for state changes */
.smooth-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Common Transitions

**Button Hover:**
```css
.button {
  transition: background 0.2s ease, 
              box-shadow 0.2s ease,
              transform 0.1s ease;
}

.button:hover {
  transform: translateY(-1px);
}

.button:active {
  transform: translateY(0);
}
```

**Input Focus:**
```css
.input {
  transition: border-color 0.2s ease,
              box-shadow 0.2s ease;
}
```

**Question Card Selection:**
```css
.question-card {
  transition: border-color 0.2s ease,
              background 0.2s ease,
              box-shadow 0.2s ease;
}
```

**Panel Scroll Fade:**
```css
.scroll-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.9));
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.scroll-container.has-scroll::after {
  opacity: 1;
}
```

### Loading States

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background: #E8E8E8;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

---

## Border Radius

The interface uses minimal, consistent border radius values for a modern, clean appearance.

### Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0px | Strict rectangular elements |
| `radius-sm` | 2px | Badges, tags |
| `radius-md` | 4px | Buttons, inputs, cards (PRIMARY) |
| `radius-lg` | 8px | Large containers, panels |
| `radius-full` | 50% | Circular elements (radio buttons, avatars) |

### Component Radius Examples

```css
/* Primary usage - most common */
.button, .input, .card {
  border-radius: 4px;
}

/* Radio buttons */
.radio-button {
  border-radius: 50%;
}

/* Timer badge */
.timer-badge {
  border-radius: 4px;
}

/* Large panels */
.modal-panel {
  border-radius: 8px;
}
```

---

## Opacity & Transparency

Opacity is used strategically for visual hierarchy, disabled states, and overlays.

### Opacity Scale

| Token | Value | Usage |
|-------|-------|-------|
| `opacity-disabled` | 0.4 | Disabled elements |
| `opacity-muted` | 0.6 | Secondary/muted content |
| `opacity-medium` | 0.8 | Hover states, semi-visible |
| `opacity-overlay` | 0.5 | Modal overlays |
| `opacity-subtle` | 0.1 | Background tints |

### Usage Examples

```css
/* Disabled state */
.button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Muted text */
.helper-text {
  opacity: 0.6;
}

/* Modal backdrop */
.modal-backdrop {
  background: rgba(0, 0, 0, 0.5);
}

/* Hover overlay */
.question-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 136, 204, 0.05);
  opacity: 0;
  transition: opacity 0.2s;
}

.question-card:hover::before {
  opacity: 1;
}
```

---

## Common Tailwind CSS Usage in Project

If this interface were built with Tailwind CSS, here are the most commonly used utility classes:

### Layout Classes

```html
<!-- Split Layout -->
<div class="grid grid-cols-[1fr_480px] gap-6 h-screen">
  <div class="overflow-y-auto p-6 bg-white"></div>
  <div class="overflow-y-auto p-5 bg-gray-50 border-l"></div>
</div>

<!-- Flexbox Utilities -->
<div class="flex items-center justify-between">
<div class="flex flex-col gap-3">
<div class="inline-flex items-center gap-2">
```

### Typography Classes

```html
<!-- Headings -->
<h1 class="text-2xl font-bold text-gray-900">
<h2 class="text-xl font-bold text-gray-900">
<h3 class="text-lg font-semibold text-gray-900">

<!-- Body Text -->
<p class="text-base leading-relaxed text-gray-800">
<p class="text-sm text-gray-600">

<!-- Labels -->
<label class="text-sm font-medium text-gray-700">
```

### Spacing Classes

```html
<!-- Common Padding -->
<div class="p-4">        <!-- 16px -->
<div class="p-6">        <!-- 24px -->
<div class="px-4 py-3">  <!-- Mixed -->

<!-- Common Margins -->
<div class="mb-4">       <!-- Margin bottom 16px -->
<div class="mt-6">       <!-- Margin top 24px -->
<div class="space-y-3">  <!-- Vertical spacing between children -->
```

### Color Classes

```html
<!-- Backgrounds -->
<div class="bg-white">
<div class="bg-gray-50">
<div class="bg-blue-50">
<div class="bg-blue-600">

<!-- Text Colors -->
<span class="text-gray-900">
<span class="text-gray-600">
<span class="text-blue-600">

<!-- Borders -->
<div class="border border-gray-300">
<div class="border-l-4 border-yellow-400">
```

### Interactive States

```html
<!-- Buttons -->
<button class="px-5 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 
               transition-all duration-200 font-semibold text-sm">

<!-- Input Fields -->
<input class="w-full px-3 py-2 border-2 border-gray-300 rounded 
              focus:border-blue-600 focus:ring focus:ring-blue-100 
              transition-all">

<!-- Cards -->
<div class="bg-white border border-gray-200 rounded p-4 
            hover:border-blue-500 hover:shadow-md transition-all">
```

### Common Component Patterns

```html
<!-- Question Card -->
<div class="bg-white border border-gray-200 rounded p-4 mb-3 
            hover:border-blue-500 hover:shadow-md transition-all cursor-pointer
            active:border-blue-700 active:bg-blue-50">
  <div class="text-sm font-bold text-blue-600 mb-2">Question 1</div>
  <p class="text-sm text-gray-700 leading-normal mb-3">Question text...</p>
</div>

<!-- Radio Option -->
<label class="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-blue-50">
  <input type="radio" class="w-4.5 h-4.5 text-blue-600 border-2 border-gray-300">
  <span class="text-sm text-gray-900">Option text</span>
</label>

<!-- Navigation Button -->
<button class="w-9 h-9 border border-gray-300 bg-white rounded text-sm font-semibold
               hover:border-blue-600 hover:bg-blue-50 transition-all
               active:bg-blue-600 active:text-white">
  1
</button>
```

---

## Example Component Reference Design Code

### Complete Question Card Component

```html
<div class="question-card" data-question-id="1">
  <!-- Question Number -->
  <div class="question-number">
    Question 1
  </div>
  
  <!-- Question Text -->
  <div class="question-text">
    Choose <strong>TRUE</strong> if the statement agrees with the information given in the text,
    choose <strong>FALSE</strong> if the statement contradicts the information, or choose 
    <strong>NOT GIVEN</strong> if there is no information on this.
  </div>
  
  <!-- Statement -->
  <div class="statement-text">
    Marie Curie's husband was a joint winner of both Marie's Nobel Prizes.
  </div>
  
  <!-- Answer Options -->
  <div class="radio-group">
    <label class="radio-option">
      <input type="radio" name="q1" value="true" class="radio-input">
      <span class="radio-label">TRUE</span>
    </label>
    
    <label class="radio-option">
      <input type="radio" name="q1" value="false" class="radio-input">
      <span class="radio-label">FALSE</span>
    </label>
    
    <label class="radio-option">
      <input type="radio" name="q1" value="not-given" class="radio-input">
      <span class="radio-label">NOT GIVEN</span>
    </label>
  </div>
</div>
```

### Complete React Component Example

```jsx
import React, { useState } from 'react';

const QuestionCard = ({ 
  questionNumber, 
  questionText, 
  statement, 
  options,
  onAnswerChange 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (value) => {
    setSelectedAnswer(value);
    onAnswerChange(questionNumber, value);
  };

  return (
    <div 
      className={`
        bg-white border rounded 
        transition-all duration-200
        ${selectedAnswer ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}
        ${isHovered ? 'border-blue-500 shadow-md' : ''}
      `}
      style={{ padding: '16px', marginBottom: '12px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Question Number */}
      <div style={{
        fontSize: '14px',
        fontWeight: 700,
        color: '#0088CC',
        marginBottom: '8px'
      }}>
        Question {questionNumber}
      </div>

      {/* Question Text */}
      <div style={{
        fontSize: '15px',
        lineHeight: 1.5,
        color: '#4A4A4A',
        marginBottom: '12px'
      }}>
        {questionText}
      </div>

      {/* Statement */}
      {statement && (
        <div style={{
          fontSize: '15px',
          fontWeight: 500,
          color: '#2B2B2B',
          marginBottom: '16px',
          paddingLeft: '12px',
          borderLeft: '3px solid #E8E8E8'
        }}>
          {statement}
        </div>
      )}

      {/* Options */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        paddingLeft: '8px'
      }}>
        {options.map((option) => (
          <label
            key={option.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              background: selectedAnswer === option.value ? '#F0F8FF' : 'transparent',
              transition: 'background 0.2s ease'
            }}
          >
            <input
              type="radio"
              name={`question-${questionNumber}`}
              value={option.value}
              checked={selectedAnswer === option.value}
              onChange={(e) => handleChange(e.target.value)}
              style={{
                appearance: 'none',
                width: '18px',
                height: '18px',
                border: `2px solid ${selectedAnswer === option.value ? '#0088CC' : '#CCCCCC'}`,
                borderRadius: '50%',
                background: selectedAnswer === option.value ? '#0088CC' : '#FFFFFF',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            />
            <span style={{
              fontSize: '15px',
              color: '#2B2B2B',
              userSelect: 'none'
            }}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
```

### Complete Navigation Bar Component

```jsx
const NavigationBar = ({ totalQuestions, currentQuestion, answeredQuestions, onNavigate }) => {
  const parts = [
    { label: 'Part 1', range: [1, 13] },
    { label: 'Part 2', range: [14, 26] },
    { label: 'Part 3', range: [27, 40] }
  ];

  return (
    <div style={{
      background: '#F5F5F5',
      borderRadius: '4px',
      padding: '16px'
    }}>
      {parts.map((part, partIndex) => (
        <div key={partIndex} style={{ marginBottom: partIndex < parts.length - 1 ? '20px' : '0' }}>
          <div style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#666',
            marginBottom: '8px'
          }}>
            {part.label}
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 36px)',
            gap: '8px'
          }}>
            {Array.from(
              { length: part.range[1] - part.range[0] + 1 },
              (_, i) => part.range[0] + i
            ).map((qNum) => (
              <button
                key={qNum}
                onClick={() => onNavigate(qNum)}
                style={{
                  width: '36px',
                  height: '36px',
                  border: currentQuestion === qNum ? '2px solid #0088CC' : '1px solid #CCCCCC',
                  background: answeredQuestions.includes(qNum) ? '#28A745' : 
                             currentQuestion === qNum ? '#0088CC' : '#FFFFFF',
                  color: answeredQuestions.includes(qNum) || currentQuestion === qNum ? '#FFFFFF' : '#2B2B2B',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  if (currentQuestion !== qNum && !answeredQuestions.includes(qNum)) {
                    e.target.style.borderColor = '#0088CC';
                    e.target.style.background = '#E6F3FF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentQuestion !== qNum && !answeredQuestions.includes(qNum)) {
                    e.target.style.borderColor = '#CCCCCC';
                    e.target.style.background = '#FFFFFF';
                  }
                }}
              >
                {qNum}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### Complete Split Layout Component

```jsx
const IELTSReadingTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: '#000000',
        height: '48px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#FFFFFF',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ fontSize: '16px', fontWeight: 600 }}>
          IELTS Reading Test
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 500,
            padding: '6px 12px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px'
          }}>
            59 minutes left
          </div>
          
          <button style={{
            padding: '8px 16px',
            background: '#FFFFFF',
            color: '#000000',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Review
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 480px',
        gap: '24px',
        height: 'calc(100vh - 48px)',
        overflow: 'hidden'
      }}>
        {/* Reading Panel */}
        <div style={{
          overflowY: 'auto',
          padding: '24px',
          background: '#FFFFFF'
        }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 700,
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '2px solid #E8E8E8'
            }}>
              Part 1
            </h2>
            
            <p style={{
              fontSize: '14px',
              color: '#666666',
              marginBottom: '16px',
              fontStyle: 'italic'
            }}>
              Read the text below and answer questions 1 – 13
            </p>
            
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              margin: '24px 0 12px'
            }}>
              The life and work of Marie Curie
            </h3>
            
            <div style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: '#2B2B2B'
            }}>
              <p style={{ marginBottom: '16px' }}>
                Marie Curie is probably the most famous woman scientist who has ever lived...
              </p>
              {/* More paragraphs */}
            </div>
          </div>
        </div>

        {/* Question Panel */}
        <div style={{
          overflowY: 'auto',
          padding: '20px',
          background: '#F5F5F5',
          borderLeft: '1px solid #E8E8E8'
        }}>
          <div style={{
            background: '#FFF9E6',
            borderLeft: '4px solid #FFC107',
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '0 4px 4px 0'
          }}>
            <p style={{ fontSize: '14px', color: '#4A4A4A', lineHeight: 1.5 }}>
              Choose <strong>TRUE</strong> if the statement agrees with the information,
              <strong> FALSE</strong> if it contradicts, or <strong>NOT GIVEN</strong> if
              there is no information.
            </p>
          </div>

          {/* Questions would go here */}
          
          {/* Navigation */}
          <NavigationBar
            totalQuestions={40}
            currentQuestion={currentQuestion}
            answeredQuestions={Object.keys(answers).map(Number)}
            onNavigate={setCurrentQuestion}
          />
        </div>
      </div>
    </div>
  );
};
```

---

## Responsive Design Considerations

### Breakpoints

| Breakpoint | Width | Layout Adjustments |
|------------|-------|-------------------|
| Desktop | ≥1280px | Full split layout |
| Laptop | 1024px - 1279px | Narrower question panel (400px) |
| Tablet | 768px - 1023px | Stacked layout with tabs |
| Mobile | <768px | Single column, swipe navigation |

### Mobile Adaptations

```css
@media (max-width: 1023px) {
  .split-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  
  .reading-panel,
  .question-panel {
    border-left: none;
  }
  
  .nav-section {
    grid-template-columns: repeat(auto-fill, 32px);
  }
  
  .nav-button {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
}
```

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Body text (#2B2B2B) on white: 13.7:1 (AAA)
- Secondary text (#4A4A4A) on white: 9.7:1 (AAA)
- Blue links (#0088CC) on white: 4.6:1 (AA)

**Keyboard Navigation:**
```css
*:focus-visible {
  outline: 2px solid #0088CC;
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

**ARIA Labels:**
```html
<button aria-label="Navigate to question 5" aria-current="true">5</button>
<input type="radio" aria-labelledby="question-1-option-true" />
<div role="timer" aria-live="polite">59 minutes left</div>
```

**Screen Reader Support:**
```html
<div role="region" aria-label="Reading passage">
<div role="radiogroup" aria-labelledby="question-1">
<nav aria-label="Question navigation">
```

---

## Performance Optimization

### CSS Best Practices

```css
/* Use transform for animations (GPU accelerated) */
.animated-element {
  transform: translateY(0);
  transition: transform 0.2s ease;
}

/* Avoid expensive properties */
.avoid {
  /* Don't animate: width, height, margin, padding */
}

.prefer {
  /* Animate: transform, opacity */
}

/* Use containment for isolated components */
.question-card {
  contain: layout style paint;
}
```

### Loading Optimization

```css
/* Critical CSS inline */
.above-fold {
  /* Header, initial viewport styles */
}

/* Defer non-critical styles */
<link rel="preload" href="fonts.css" as="style">
<link rel="stylesheet" href="fonts.css" media="print" onload="this.media='all'">
```

---

## Print Styles

```css
@media print {
  .header-bar,
  .nav-section,
  .button-group {
    display: none;
  }
  
  .split-layout {
    grid-template-columns: 1fr;
  }
  
  .question-panel {
    border-left: none;
  }
  
  .question-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  
  body {
    font-size: 12pt;
    line-height: 1.5;
  }
}
```

---

## Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: #0088CC;
  --color-primary-hover: #006BA3;
  --color-text-primary: #2B2B2B;
  --color-text-secondary: #4A4A4A;
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F5F5F5;
  --color-border: #E8E8E8;
  --color-success: #28A745;
  --color-warning: #FFC107;
  --color-error: #DC3545;
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.12);
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;
}
```

---

## Key Design Principles Summary

1. **Clarity First**: Every element serves a functional purpose
2. **Minimal Distractions**: Clean interface keeps focus on content
3. **Consistent Spacing**: 8px base grid system throughout
4. **Accessible by Default**: High contrast, keyboard navigation, ARIA labels
5. **Performance Optimized**: GPU-accelerated animations, efficient rendering
6. **Responsive & Adaptive**: Works across all device sizes
7. **Professional Aesthetic**: Modern without being trendy
8. **User-Centered**: Designed for extended testing sessions

This style guide provides a complete foundation for building or extending an IELTS-style examination interface with consistent, accessible, and professional design patterns.
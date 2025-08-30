# BikeForU - Landing Page

A clean, modern landing page for the BikeForU application with a nature-inspired design system.

## 🎨 Design System

This project uses a comprehensive design system inspired by the iOS app, featuring:

### Color Palette
- **Light Theme**: Warm cream backgrounds with earthy browns and forest greens
- **Dark Theme**: Deep charcoal with warm accent colors
- **Nature-Inspired**: Colors mimic outdoor environments (forests, mountains, earth, sky)

### Key Colors
- Primary: `#654321` (Dark Brown) / `#CD853F` (Dark)
- Secondary: `#A0522D` (Sienna) / `#DEB887` (Dark)
- Accent: `#8B4513` (Saddle Brown) / `#D2691E` (Dark)
- Trail: `#228B22` (Forest Green) / `#32CD32` (Dark)
- Sky: `#87CEEB` (Sky Blue) / `#4682B4` (Dark)

## 🏗️ Project Structure

```
src/
├── pages/
│   ├── Home.tsx              # Main landing page
│   ├── EmailVerification.tsx # Email verification (backend function)
│   └── PasswordReset.tsx     # Password reset (backend function)
├── lib/
│   └── supabase.ts          # Supabase configuration
├── App.tsx                  # Main app with routing
└── index.css                # Design system CSS variables
```

## 🚀 Features

- **Landing Page**: Beautiful hero section with video background
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: Automatic system preference detection
- **Backend Functions**: Email verification and password reset via Supabase
- **Modern UI**: Smooth animations and transitions

## 🛠️ Tech Stack

- React 18 with TypeScript
- Tailwind CSS with custom design system
- Supabase for backend functions
- React Router for navigation

## 📱 Pages

### Home (`/`)
- Hero section with video background
- Feature highlights
- Call-to-action sections
- No authentication required

### Email Verification (`/verify`)
- Backend function for email verification
- Requires valid token

### Password Reset (`/reset-password`)
- Backend function for password reset
- Requires valid token

## 🎯 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_SITE_URL=your_site_url
   ```

3. Start development server:
   ```bash
   npm start
   ```

## 🌟 Design Principles

- **Nature-Inspired**: Colors and themes reflect outdoor activities
- **Accessibility**: High contrast ratios and readable typography
- **Consistency**: Systematic color usage across all components
- **Smooth Transitions**: 150ms animations for better UX

## 📝 Notes

- All authentication pages have been removed
- Only essential backend functions remain
- Design system is fully integrated with Tailwind CSS
- Automatic dark mode detection based on system preferences 
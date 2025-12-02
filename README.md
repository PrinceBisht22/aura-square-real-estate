# Aura Square - Real Estate Platform

A modern, full-featured real estate platform built with React, Vite, and Tailwind CSS.

## Features

- 🏠 Property listings (Buy, Rent, Commercial, Plots)
- 🧮 Financial calculators (EMI, Loan Eligibility, Budget, Area Converter)
- 💬 AI-powered chatbot with FAQ fallback
- 🔐 OAuth authentication (Google + Apple)
- 📸 Multi-image property galleries with drag-drop upload
- 🎨 Custom glass halo cursor
- 📱 Fully responsive design
- ✨ Smooth animations and micro-interactions
- 📧 Newsletter subscription
- 🔍 Advanced search and filters

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aura_square
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure environment variables (see Configuration section below)

5. Start development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add authorized JavaScript origins: `http://localhost:5173`
6. Add authorized redirect URIs: `http://localhost:5173`
7. Copy the Client ID to `.env`:
```
VITE_GOOGLE_CLIENT_ID=your-client-id-here
```

### Apple Sign In Setup

Apple Sign In requires server-side implementation. For development:

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Create an App ID with "Sign in with Apple" capability
3. Create a Service ID
4. Configure redirect URLs
5. Generate a private key
6. Add to `.env` (server-side only):
```
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
APPLE_PRIVATE_KEY=your-private-key
APPLE_CALLBACK_URL=https://yourdomain.com/api/auth/apple/callback
```

**Note**: Apple Sign In currently shows a fallback message. Full implementation requires a backend server.

### OpenAI API (Optional)

For AI chatbot functionality:

1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env`:
```
VITE_OPENAI_API_KEY=sk-your-key-here
```

If not provided, the chatbot will use an intelligent FAQ fallback system.

### Custom Cursor & Animations

Toggle features via environment variables:

```bash
# Disable custom cursor
VITE_CUSTOM_CURSOR=false

# Disable animations
VITE_ENABLE_ANIMATIONS=false
```

The custom cursor automatically disables on:
- Mobile/touch devices
- When `prefers-reduced-motion` is enabled

## File Upload Configuration

### Option 1: Local Storage (Development)

Default setup stores files locally:
```
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB
```

### Option 2: AWS S3 (Production)

1. Create an S3 bucket
2. Configure IAM user with S3 permissions
3. Add to `.env`:
```
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=aurasquare-uploads
```

### Option 3: Cloudinary (Alternative)

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get credentials from dashboard
3. Add to `.env`:
```
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

Preview production build:
```bash
npm run preview
```

## Project Structure

```
aura_square/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Header.jsx    # Mega-menu header
│   │   ├── Footer.jsx    # Expanded footer
│   │   ├── CustomCursor.jsx  # Glass halo cursor
│   │   ├── ChatWidget.jsx # AI chatbot
│   │   └── ...
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   │   ├── api.js       # API calls
│   │   ├── auth.js      # Authentication
│   │   ├── oauth.js     # OAuth handlers
│   │   └── calculators.js  # Calculator logic
│   ├── data/            # Mock data
│   ├── layouts/         # Layout components
│   └── styles/          # Global styles
├── public/              # Static assets
├── .env.example         # Environment template
└── package.json
```

## Key Features Implementation

### Mega-Menu Header

- Hover over nav items (Buy, Rent, etc.) to see expandable panels
- Multi-column layout with categories, popular links, and promos
- Keyboard accessible (Arrow keys, Enter, Escape)
- Mobile: Full-screen drawer with accordion

### Custom Cursor

- Glass halo design with teal accent (#0EA5A4)
- Grows on hover (1.8x)
- Shows magnifier icon over search fields
- Shrinks when idle
- Respects `prefers-reduced-motion`

### Property Photo Upload

- Drag & drop multiple images
- Preview thumbnails
- Reorder by drag or buttons
- Delete individual images
- First image marked as "Main"

### Newsletter Subscription

- Email validation
- Stores subscribers in localStorage (dev) or database (prod)
- Success/error feedback
- Endpoint: `POST /api/newsletter`

## API Endpoints (Server-Side)

For production, implement these endpoints:

- `POST /api/auth/google` - Google OAuth callback
- `POST /api/auth/apple` - Apple Sign In callback
- `POST /api/newsletter` - Newsletter subscription
- `POST /api/contact` - Contact form submission
- `POST /api/properties` - Property submission
- `POST /api/upload` - File upload handler

## Testing Checklist

### Authentication
- [ ] Google OAuth login works
- [ ] Google OAuth signup works
- [ ] Apple Sign In shows appropriate message
- [ ] Email/password login works
- [ ] User profile appears in header
- [ ] Logout works correctly

### Property Features
- [ ] Multi-image upload works
- [ ] Drag-drop reordering works
- [ ] Image deletion works
- [ ] Property detail carousel works
- [ ] Lightbox opens correctly
- [ ] Thumbnail navigation works

### UI/UX
- [ ] Mega-menu opens on hover
- [ ] Mega-menu keyboard navigation works
- [ ] Custom cursor appears (desktop only)
- [ ] Cursor grows on hover
- [ ] Animations are smooth
- [ ] Mobile menu works
- [ ] Footer newsletter signup works

### Responsiveness
- [ ] Mobile layout is correct
- [ ] Tablets display properly
- [ ] Desktop layout is optimal
- [ ] Touch gestures work on mobile
- [ ] No horizontal scrolling

### Calculators
- [ ] EMI Calculator calculates correctly
- [ ] Loan Eligibility works
- [ ] Budget Calculator functions
- [ ] Area Converter converts properly
- [ ] All calculators are mobile-friendly

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Proprietary - Aura Square Realty Pvt. Ltd.

## Support

For issues or questions:
- Email: hello@aurasquare.com
- Phone: +91 89290 12345


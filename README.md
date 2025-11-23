# Composter - Your Personal Component Vault

Hey there! Welcome to Composter, a slick web app I built for managing and sharing React components. Think of it as your own personal library where you can store, organize, and pull components whenever you need them.

## What's This All About?

Ever found yourself copy-pasting the same component across different projects? Or wishing you had a centralized place to store all those cool UI elements you've built? That's exactly why I created Composter.

It's a full-stack application (well, mostly frontend for now) that lets you:
- Upload and store your React components
- Browse through your component library with a beautiful UI
- Read comprehensive documentation
- Try out an interactive terminal simulation
- Manage your settings and preferences

## Tech Stack

Here's what powers Composter:

### Frontend
- **React** - The UI library we all know and love
- **Vite** - Lightning-fast build tool (seriously, it's so much faster than Webpack)
- **Tailwind CSS** - For styling without the headache
- **React Router** - Handles all our navigation
- **Sandpack** - That cool code preview you see on component details
- **Lucide React** - Clean, consistent icons

### Styling Approach
I went with a dark, glassmorphic design that gives it a premium, modern feel. You'll see a lot of purple gradients, subtle animations, and smooth transitions throughout the app.

## Getting Started

Alright, let's get you up and running!

### Prerequisites

Make sure you have these installed:
- Node.js (v16 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)

### Installation

1. **Clone the repo** (or you already have it, so skip this)
   ```bash
   cd "Composter-main 2"
   ```

2. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```
   This might take a minute or two. Go grab a coffee while you wait.

4. **Start the dev server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   The app should automatically open at `http://localhost:5173`. If it doesn't, just paste that URL into your browser.

That's it! You should now see the landing page with all its glory.

## Project Structure

Let me walk you through how everything is organized:

```
frontend/
├── src/
│   ├── components/          # All our React components
│   │   ├── external/        # The fancy components (GlassSurface, GlareHover, etc.)
│   │   ├── layout/          # Layout wrappers (Sidebar, Topbar, etc.)
│   │   └── ui/              # Reusable UI elements (Button, Card, Input, etc.)
│   │
│   ├── pages/               # Each page of the app
│   │   ├── Auth/            # Login, Signup, Reset Password
│   │   ├── Dashboard/       # Main dashboard pages
│   │   └── Docs/            # Documentation and Terminal
│   │
│   ├── data/                # Mock data for components
│   │   └── components.js    # Real component examples
│   │
│   ├── router/              # React Router configuration
│   │   └── AppRouter.jsx    # All our routes live here
│   │
│   └── main.jsx             # Entry point
│
├── public/                  # Static assets
└── index.html               # The HTML template
```

## Key Features Explained

### 1. Landing Page (`src/pages/LandingPage.jsx`)
This is the first thing users see. It's got that cool wave animation in the background (using OGL - a lightweight WebGL library) and explains what Composter is all about.

### 2. Authentication (`src/pages/Auth/`)
Right now, the auth pages are purely frontend - they look good but don't actually authenticate anyone yet. That's where the backend will come in later.

### 3. Dashboard (`src/pages/Dashboard/`)
This is where the magic happens:
- **Home**: Shows stats and recent components
- **My Components**: A grid view of all your components
- **Component Detail**: Click any component to see its code, preview, and versions
- **Upload**: Form to add new components
- **Settings**: Manage your profile (you can even upload an avatar!)

### 4. Documentation (`src/pages/Docs/`)
A comprehensive guide with:
- Getting started instructions
- CLI command examples
- Best practices
- FAQ section
- **Interactive Terminal**: This one's fun - try typing `help` or `login`!

## Understanding the Design System

### Core Components

#### GlassSurface (`src/components/external/GlassSurface.jsx`)
This is the star of the show. It creates that frosted glass effect you see everywhere. It uses SVG filters to distort the background, creating a premium, iOS-like feel.

**How it works:**
- Generates an SVG displacement map on the fly
- Applies backdrop filters
- Adjusts for light/dark mode automatically

#### GlareHover (`src/components/external/GlareHover.jsx`)
Creates that satisfying glare effect when you hover over buttons. It's like a little reward for your cursor.

### Reusable UI Components (`src/components/ui/`)

These are built on top of the fancy external components:
- **Button**: Uses GlareHover as its base
- **Card**: Wraps GlassSurface for consistent card styling
- **Input**: Dark-themed input fields with focus states
- **Modal**: For popups and overlays
- **CodeBlock**: Displays code with syntax highlighting

## Making Changes

### Want to add a new page?

1. Create your page component in `src/pages/`
2. Add a route in `src/router/AppRouter.jsx`
3. (Optional) Add a navigation link in `src/components/layout/Sidebar.jsx`

### Want to add a new component to the library?

Edit `src/data/components.js` and add your component object with:
- `id`: Unique number
- `name`: Component name
- `description`: What it does
- `tags`: Array of tags
- `version`: Like "1.0.0"
- `updated`: "2 days ago" or whatever
- `author`: Your name!
- `code`: The actual component code as a template string

## Common Issues

**Port already in use?**
If you get an error about port 5173 being in use, either:
- Kill whatever's using that port
- Or Vite will automatically try 5174, 5175, etc.

**Styles not loading?**
Make sure you ran `npm install` - Tailwind needs to be properly set up.

**Build errors?**
Check the console - it's usually a missing import or a typo in JSX.

## Build for Production

When you're ready to deploy:

```bash
npm run build
```

This creates an optimized build in the `dist/` folder. You can then deploy this to Vercel, Netlify, or wherever you like.

## Learning Resources

If you're new to any of these technologies:
- [React Docs](https://react.dev) - Official React documentation
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Vite Guide](https://vitejs.dev/guide/) - Modern build tool
- [React Router](https://reactrouter.com) - Client-side routing

## Contributing

Found a bug? Want to add a feature? Here's how:

1. Make your changes
2. Test them locally (make sure `npm run build` works)
3. Commit with a clear message about what you changed

## Future Plans

Here's what's on the roadmap:
- [ ] Actual backend with authentication
- [ ] Real database for storing components
- [ ] CLI tool to push/pull components
- [ ] Public component marketplace
- [ ] Component versioning system
- [ ] Search and filtering improvements

## Credits

Built with love and way too much coffee by Somesh Talligeri.

Special thanks to:
- ReactBits.dev for design inspiration
- The amazing open-source community
- You, for checking out this project!

## License

This project is open source and available under the MIT License.

---

**Questions?** Feel free to reach out or open an issue. Happy coding!

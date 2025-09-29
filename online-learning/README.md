# SkillShare - Online Learning Platform

A modern skill-sharing platform built with Next.js, TypeScript, TailwindCSS, and MongoDB.

## Features

- **Authentication System**: Sign up/Sign in for both tutors and learners
- **Role-based Access**: Separate interfaces for tutors and learners
- **Guest Access**: Browse content without registration
- **Database Integration**: MongoDB for user data storage
- **Modern UI**: Built with TailwindCSS and Shadcn UI components
- **Form Validation**: Zod schema validation
- **API Integration**: Axios for HTTP requests
- **State Management**: TanStack Query for server state

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Database**: MongoDB
- **Authentication**: JWT with Argon2 password hashing
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/skillshare
   JWT_SECRET=your-super-secret-jwt-key-here
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Main Page Features

1. **Sign Up/Sign In**: Users can register or log in as either tutors or learners
2. **Role Selection**: Clear distinction between tutor and learner roles
3. **Guest Access**: "Continue as Guest" button links to the main application
4. **Responsive Design**: Works on desktop and mobile devices

### Authentication Flow

1. Users select their role (Tutor or Learner)
2. Fill in required information (name, email, password)
3. Password confirmation for sign-up
4. Form validation with error messages
5. Successful authentication redirects to the main app

### API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

## Project Structure

```
src/
├── app/
│   ├── api/auth/          # Authentication API routes
│   ├── firstPage/         # Main application page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── providers.tsx      # Query client provider
├── components/
│   ├── ui/               # Reusable UI components
│   └── AuthForm.tsx      # Authentication form
├── lib/
│   ├── api.ts            # API client configuration
│   ├── auth.ts           # Authentication utilities
│   ├── mongodb.ts        # MongoDB connection
│   ├── utils.ts          # Utility functions
│   └── validations.ts    # Zod schemas
└── types/
    └── user.ts           # TypeScript type definitions
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NEXT_PUBLIC_API_URL`: API base URL for client-side requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

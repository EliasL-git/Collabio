# Collabio

A modern workspace platform built with Next.js, PostgreSQL, and TypeScript - an open-source alternative to Google Workspace.

## Features

- 🔐 **Authentication System** - Secure user authentication with NextAuth.js
- 👥 **Role-Based Access Control** - Admin panel for managing user permissions
- 📝 **Notes App** - Simple and efficient note-taking
- ✍️ **Markdown Studio** - Markdown editor with live preview
- 🎨 **Office 365-Inspired UI** - Clean and modern interface
- 🐳 **Docker Support** - Easy deployment with Docker and Docker Compose
- 🗄️ **PostgreSQL Database** - Reliable data storage with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (beta - required for Next.js App Router support)
- **Containerization**: Docker & Docker Compose

> **Note:** This project uses NextAuth.js v5 (beta) which is required for Next.js 14+ App Router compatibility. The beta version is stable enough for production use with the App Router.

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (or use Docker)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/EliasL-git/Collabio.git
cd Collabio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/collabio?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production-min-32-characters-long"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Generate Prisma Client:
```bash
npx prisma generate
```

6. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Docker Deployment

### Using Docker Compose

1. Update the `.env` file with your database credentials

2. Start the containers:
```bash
docker-compose up -d
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Building Docker Image

```bash
docker build -t collabio .
```

## Project Structure

```
Collabio/
├── app/                    # Next.js app directory
│   ├── (main)/            # Main authenticated routes
│   │   ├── dashboard/     # Dashboard page
│   │   ├── apps/          # Application pages
│   │   │   ├── notes/     # Notes app
│   │   │   └── markdown-studio/  # Markdown editor
│   │   └── admin/         # Admin panel
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── layout.tsx         # Root layout
├── apps/                  # Modular apps folder
│   ├── notes/            # Notes app modules
│   └── markdown-studio/  # Markdown app modules
├── components/           # React components
├── lib/                  # Utility libraries
├── prisma/              # Database schema and migrations
├── types/               # TypeScript type definitions
├── Dockerfile           # Docker configuration
└── docker-compose.yml   # Docker Compose configuration
```

## Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User** - User accounts with role-based access
- **Permission** - Fine-grained app permissions
- **Note** - Notes app data
- **Document** - Markdown documents

## User Roles

- **USER** - Standard user with access to applications
- **ADMIN** - Administrator with permission management capabilities

## Admin Features

Administrators can:
- Manage user roles (USER/ADMIN)
- Configure app-level permissions for users
- Grant/revoke access, edit, and delete permissions per app

## Adding New Apps

See `/apps/README.md` for instructions on adding new applications to the platform.

## Development

### Run Prisma Studio
```bash
npx prisma studio
```

### Run Database Migrations
```bash
npx prisma migrate dev --name your_migration_name
```

### Build for Production
```bash
npm run build
npm run start
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


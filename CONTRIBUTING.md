# Contributing to Collabio

Thank you for your interest in contributing to Collabio! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/Collabio.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes: `git commit -m "Add your feature"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your environment:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Seed the database (optional):
```bash
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

## Code Style

- We use ESLint for code linting
- Run `npm run lint` before committing
- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful commit messages

## Adding New Apps

To add a new application to Collabio:

1. Create a folder in `/apps/your-app-name`
2. Create the UI in `/app/(main)/apps/your-app-name/page.tsx`
3. Add API routes in `/app/api/your-app-name/route.ts`
4. Update the Prisma schema if needed
5. Add the app to the sidebar navigation
6. Update documentation

## Testing

- Test your changes manually before submitting
- Ensure the build passes: `npm run build`
- Ensure linting passes: `npm run lint`

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Update documentation if needed
- Add screenshots for UI changes
- Ensure all tests pass
- Follow the PR template

## Reporting Issues

- Use the GitHub issue tracker
- Provide detailed information
- Include steps to reproduce
- Add screenshots if applicable

## License

By contributing to Collabio, you agree that your contributions will be licensed under the MIT License.

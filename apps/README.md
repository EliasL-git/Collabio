# Collabio Apps

This folder contains modular applications that can be integrated into the Collabio workspace platform.

## Available Apps

### Notes
Location: `/apps/notes`
A simple note-taking application with CRUD operations.

### Markdown Studio
Location: `/apps/markdown-studio`
A markdown editor with live preview functionality.

## Adding New Apps

To add a new app to the Collabio workspace:

1. Create a new folder in the `/apps` directory with your app name
2. Add your app's backend logic or configuration
3. Create a corresponding route in `/app/(main)/apps/[your-app-name]`
4. Add the app entry in the sidebar navigation (`/components/Sidebar.tsx`)
5. Optionally, add a Prisma model for your app's data in `/prisma/schema.prisma`
6. Optionally, create API routes in `/app/api/[your-app-name]`

## App Structure

Each app should follow this structure:
```
apps/
  your-app/
    README.md          # App documentation
    config.json        # App configuration (optional)
    [other files]      # Additional app files
```

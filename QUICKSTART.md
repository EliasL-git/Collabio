# Collabio Quick Start Guide

Get Collabio up and running in 5 minutes!

## Option 1: Docker (Recommended)

The fastest way to get started is using Docker Compose.

### Prerequisites
- Docker
- Docker Compose
- **An external PostgreSQL database** (version 16+ recommended)

### Steps

**Important:** This application requires an external PostgreSQL database. You must have a PostgreSQL instance running and accessible before proceeding.

1. Clone the repository:
```bash
git clone https://github.com/EliasL-git/Collabio.git
cd Collabio
```

2. Set your environment variables:
```bash
# Set your database connection string (REQUIRED)
export DATABASE_URL="postgresql://user:password@your-db-host:5432/collabio?schema=public"

# Set a secure secret (REQUIRED)
export NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Optional: Set the application URL (defaults to http://localhost:3000)
export NEXTAUTH_URL="http://localhost:3000"
```

Alternatively, create a `.env` file in the project root:
```env
DATABASE_URL="postgresql://user:password@your-db-host:5432/collabio?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production-min-32-characters-long"
```

3. Start the application:
```bash
docker-compose up -d
```

4. Wait for the container to start (about 30 seconds)

5. Open your browser to [http://localhost:3000](http://localhost:3000)

### Default Credentials

If you seed the database (optional step), you can use these default credentials:

- **Admin Account**
  - Email: `admin@collabio.local`
  - Password: `admin123`

- **User Account**
  - Email: `user@collabio.local`
  - Password: `user123`

**⚠️ IMPORTANT:** Change these passwords immediately after first login!

To seed the database, run:
```bash
docker exec collabio-app npx prisma db seed
```

## Option 2: Local Development (Interactive Setup)

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- npm

### Steps

1. Clone and install:
```bash
git clone https://github.com/EliasL-git/Collabio.git
cd Collabio
npm install
```

2. Set up your database:
```bash
# Create a PostgreSQL database
createdb collabio

# Or using psql
psql -U postgres -c "CREATE DATABASE collabio;"
```

3. Run the interactive setup wizard:
```bash
npm run setup
```

The wizard will guide you through:
- ✅ Database configuration check
- ✅ Prisma Client generation
- ✅ Database connection test
- ✅ Running migrations
- ✅ Creating your admin account

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Next Steps

After logging in:

1. **Change Default Passwords** (if using seed data)
   - Go to your user profile
   - Update your password

2. **Explore the Apps**
   - **Notes**: Create and manage quick notes
   - **Markdown Studio**: Write and preview markdown documents

3. **Admin Features** (for admin users)
   - Navigate to Admin → Permissions
   - Manage user roles and app permissions

4. **Add More Apps**
   - See `/apps/README.md` for instructions
   - Check out `CONTRIBUTING.md` for development guidelines

### Troubleshooting

### Database Connection Issues
- Ensure your external PostgreSQL database is running and accessible
- Check your DATABASE_URL in `.env` or environment variables
- Verify database credentials and host/port information
- Ensure your database host is accessible from the Docker container
- For localhost databases, use `host.docker.internal` instead of `localhost` on macOS/Windows

### Docker Issues
- Run `docker-compose logs` to see error messages
- Ensure port 3000 is not in use
- Try `docker-compose down` then `docker-compose up -d`
- Check that DATABASE_URL and NEXTAUTH_SECRET environment variables are set

### Build Errors
- Run `npm install` to ensure dependencies are installed
- Run `npx prisma generate` to regenerate Prisma Client
- Clear `.next` folder: `rm -rf .next`

## Getting Help

- Check the [README.md](README.md) for detailed documentation
- See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Open an issue on GitHub for bugs or questions

## What's Next?

- Customize the UI to match your brand
- Add more applications to the workspace
- Configure production deployment
- Set up backups for your database

Happy collaborating! 🚀

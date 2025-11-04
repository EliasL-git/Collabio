# Collabio Quick Start Guide

Get Collabio up and running in 5 minutes!

## Option 1: Docker (Recommended)

The fastest way to get started is using Docker Compose.

### Prerequisites
- Docker
- Docker Compose

### Steps

1. Clone the repository:
```bash
git clone https://github.com/EliasL-git/Collabio.git
cd Collabio
```

2. Set your environment variables:
```bash
# Set a secure secret (required)
export NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

3. Start the application:
```bash
docker-compose up -d
```

4. Wait for the containers to start (about 30 seconds)

5. Open your browser to [http://localhost:3000](http://localhost:3000)

### Default Credentials

- **Admin Account**
  - Email: `admin@collabio.local`
  - Password: `admin123`

- **User Account**
  - Email: `user@collabio.local`
  - Password: `user123`

**⚠️ IMPORTANT:** Change these passwords immediately after first login!

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

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check your DATABASE_URL in `.env`
- Verify database credentials

### Docker Issues
- Run `docker-compose logs` to see error messages
- Ensure ports 3000 and 5432 are not in use
- Try `docker-compose down -v` then `docker-compose up -d`

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

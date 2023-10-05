# Convenient Whitelist for Minecraft Servers Backend

This application allows admins and moderators to easily manage a whitelist for their Minecraft server.
The Backend provides an API to be used for CRUD operations. 

This is a Prisma, PostgreSQL, and Express application for users to register to a Minecraft server.
## Features

- User registration with Minecraft username
- Admin authentication
- Automatic Minecraft server whitelist management through RCON

## Database Entity Relationship Model

```mermaid
erDiagram
    Admin ||--o{ InvitationCode : sends
    User }|--o{ Admin : approves
    User {
        id INT PK
        minecraftUsername VARCHAR
        gameType VARCHAR
        approved BOOLEAN 
        createdAt DateTime 
        updatedAt DateTime 
    }
    Admin {
        id INT PK
        username VARCHAR 
        password VARCHAR
        email VARCHAR 
        createdAt DateTime 
        updatedAt DateTime 
    }
    InvitationCode {
        id INT 
        code VARCHAR 
        used BOOLEAN 
    }
```

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/) (14.x or later is recommended)
- You have an SQLite database available
- You have access to a Minecraft server with RCON enabled

## Installation

1. Navigate into the folder:
```bash
cd convitelist/backend
```

2. Install the dependencies:
```bash
npm install
```

3. Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your SQLite database URL, RCON credentials, and other configuration options.

5. Run the database migrations:
```bash
npx prisma migrate deploy
```
or
```bash
npx prisma migrate dev --name init    # for development to create a database
```

6. Generate the Prisma client:
```bash
npx prisma generate
```

7. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3001`.

8. Build the application:
```bash
npm run build
```

9. Start the production server:
```bash
npm run start
```

10. Generate a token in the console to create the first admin user:
```bash
node src/scripts/testInvitationCode.js # copy the token
```

## Deployment

The deployment process will depend on your chosen hosting provider. Please consult the provider's documentation for deploying Node.js applications and configuring environment variables.
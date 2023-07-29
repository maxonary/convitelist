# Convenient Whitelist for Minecraft Servers Backend

This application allows admins and moderator to easily manage a whitelist for their Minecraft server.
The Backend provides an API to be used for CRUD operations. 

This is a Prisma, PostgreSQL, and Express application for users to register to a Minecraft server.
## Features

- User registration with Minecraft username
- Admin authentication
- Automatic Minecraft server whitelist management through RCON

## Database Entity Relationship Model

```mermaid
erDiagram
    User ||--o{ InvitationCode : has
    User ||--o{ Admin : "Approves"
    User {
        id INT [PK]
        minecraftUsername VARCHAR [UNIQUE]
        gameType VARCHAR
        approved BOOLEAN [DEFAULT=false]
        createdAt DateTime [DEFAULT=now()]
        updatedAt DateTime [UpdatedAt]
    }
    Admin {
        id INT [PK]
        username VARCHAR [UNIQUE]
        password VARCHAR
        email VARCHAR [UNIQUE]
        createdAt DateTime [DEFAULT=now()]
        updatedAt DateTime [UpdatedAt]
    }
    InvitationCode {
        id INT [PK]
        code VARCHAR [UNIQUE]
        used BOOLEAN [DEFAULT=false]
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

6. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3001`.

7. Build the application:
```bash
npm run build
```

8. Start the production server:
```bash
npm run start
```

9. Generate a token in the console to create the first admin user:
```bash
node run scr/scripts/testInvitationCode.js # copy the token
```

## Deployment

The deployment process will depend on your chosen hosting provider. Please consult the provider's documentation for deploying Node.js applications and configuring environment variables.
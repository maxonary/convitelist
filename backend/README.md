# Convinient Whitelist for Minecraft Servers

This application allows admins and moderator to easily manage a whitelist for their Minecraft server.
Users can be added and removed from the whitelist by simply clicking on a corresponding button in the admin panel.

Users can also be added by registering on the website. They can log in with their minecraft username or via the Microsoft XBox integration.

This is a Prisma, PostgreSQL, and Express application for users to register to a Minecraft server. Admins can accept or reject the applications through an admin panel, which automatically adds or removes the players from the Minecraft Server's whitelist.

## Features

- User registration with Minecraft username
- Admin authentication
- Admin panel for approving or rejecting users
- Automatic Minecraft server whitelist management through RCON

## Future Features
* Microsoft XBox authentication
* Automatically insert users on first join
* User profile page
* User profile picture
* Check valid names by length and characters
* Autosync with whitelist
* Admin Pannel
* Server statistics

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/) (14.x or later is recommended)
- You have a PostgreSQL database available
- You have access to a Minecraft server with RCON enabled

## Installation

1. Clone this repository:
```bash
git clone https://github.com/your_username/your_project_name.git
cd convitelist
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

## Deployment

The deployment process will depend on your chosen hosting provider. Please consult the provider's documentation for deploying Node.js applications and configuring environment variables.
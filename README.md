# Convenient Whitelist for Minecraft Servers

This application allows admins and moderators to easily manage a whitelist for their Minecraft server.
Users can be added and removed from the whitelist by simply clicking a checkbox.

Users register by themselves on the website. The Minecraft options looking like screen guides the user through the process of registering.
They can enter their minecraft username, select their game type (Java and Bedrock Edition) and submit straight for approval.
Then a registered admin can login to the admin pannel to review all submissions. 

This application consists of two parts: A Backend built on Prisma, SQLite, and Express, and a Frontend build on React. 

It is recommended to have the Minecraft Server running and to use [MC-Sleeping-Server-Starter](https://github.com/vincss/mcsleepingserverstarter). 

For further details check the dedicated Backend and Frontend README docs.

## Features

- Minecraft style interface
- User registration with Minecraft username and error checking
- Admin authentication and registration with tokens
- Admin panel for approving or rejecting users and registering new admins
- Automatic Minecraft server whitelist management through RCON
- Server Status when using [MC-Sleeping-Server-Starter](https://github.com/vincss/mcsleepingserverstarter) (recommended)

## Future Features

* Bedrock support with Floodgate integration
* Microsoft XBox authentication
* Automatically insert users on first join
* Server statistics icluding graphs

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/) (14.x or later is recommended)
- You have access to a Minecraft server with RCON enabled
- (You have installed [MC-Sleeping-Server-Starter](https://github.com/vincss/mcsleepingserverstarter) on top of your Minecraft server)

## Installation

Generally you can follow this guideline. Else you find more detailed descriptions in the dedicated Backend and Frontend README docs. 

1. Clone this repository:
```bash
git clone https://github.com/maxonary/convitelist
cd convitelist
```

2. Install the dependencies:
```bash
npm install ./backend && npm install ./frontend
```

3. Copy the `.env.example` files for Back- and Frontend to `.env`:
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

7. Or start the production server:
```bash
npm run start
```

The Backend application will be available at `http://localhost:3001` 
and the Backend application will be available at `http://localhost:3000` 

## Deployment

The deployment process will depend on your chosen hosting provider. Please consult the provider's documentation for deploying Node.js and React applications and configuring environment variables.
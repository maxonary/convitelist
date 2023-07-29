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

## Website Architecture
```
bash
                    +----------------------+
                    |   User's Web Browser |
                    +----------------------+
                                |
                        (1) HTTP Request (GET)
                                |
                                v
                    +-----------------------+
                    |      Frontend App     |
                    |  (React, React Router)|
                    +-----------------------+
                                |
             (2) Client-Side Routing (React Router)
                                |
                                v
                    +-----------------------+
                    |      Frontend API     |
                    | (Axios, Fetch, etc.)  |
                    +-----------------------+
                                |
                     (3) HTTP Request (GET/POST)
                                |
                                v
              +----------------------------------+
              |        Backend Server            |
              | (Node.js, Express, SQLite, etc.) |
              +----------------------------------+
                                |
            (4) Authentication (Passport, JWT, etc.)
                                |
                                v
              +----------------------------------+
              |       Session Management         |
              | (Cookies, Express-Session, etc.) |
              +----------------------------------+
                                |
                   (5) HTTP Request (GET/POST)
                                |
                                v
                      +------------------+
                      |     Database     |
                      |    (MongoDB)     |
                      +------------------+
                                |
                       (6) Query Response
                                |
                                v
                      +------------------+
                      |      Backend     |
                      |  Data Processing |
                      +------------------+
                                |
                    (7) HTTP Response (JSON)
                                |
                                v
                        +--------------+
                        |   Backend    |
                        |   Rendering  |
                        +--------------+
                                |
                  (8) HTTP Response (HTML/JS/CSS)
                                |
                                v
                       +----------------+
                       | User's Browser |
                       |    Rendering   |
                       +----------------+
```

1. The user's web browser sends an HTTP request (GET) to the website to load the page.

2. The frontend app (React) handles the routing and sends additional HTTP requests (GET/POST) to interact with the backend server.

3. The backend server (Node.js, Express) processes the requests, interacts with the database (SQLite), and sends an HTTP response (JSON) back to the frontend app.

4. The frontend app updates parts of the UI based on the response received from the server.

5. The user's web browser renders the updated UI, and makes the website interactive.

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
cd backend && npm install && cd ../frontend && npm install
```

3. Copy the `.env.example` files for Back- and Frontend to `.env`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your SQLite database URL, RCON credentials, and other configuration options.

5. Run the database migrations in the backend folder:
```bash
cd backend && npx prisma migrate deploy
```
or
```bash
cd backend && npx prisma migrate dev --name init    # for development to create a database
```

6. Start the development server (individually):
```bash
npm run dev
```

7. Build the code for production (individually):
```bash
npm run build
```

8. Start the production server (individually):
```bash
npm run start
```

The Backend application will be available at `http://localhost:3001` 
and the Backend application will be available at a free port (normally `http://localhost:3000`)

## Deployment

The deployment process will depend on your chosen hosting provider. Please consult the provider's documentation for deploying Node.js and React applications and configuring environment variables.
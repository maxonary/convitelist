# ![minecraft_title](https://github.com/maxonary/convitelist/assets/62939182/6ba92ce8-031b-4cba-954c-16ce3adbab59)

# A Convenient Whitelist Manager for Minecraft Servers

This application allows admins and moderators to manage a whitelist for their Minecraft server efficiently.
Users can be added and removed from the whitelist by simply clicking a checkbox.

Users register by themselves on the website. The Minecraft options menu inspires the style and guides the user through registration.
They can enter their Minecraft username, select their game type (Java and Bedrock Edition), and submit for approval.
Then, a registered admin can log in to the admin panel to review all submissions. 

This application consists of two parts: A Backend built on Prisma, SQLite, and Express, and a Frontend built on React. 

To use all the features, you must have a Paper Minecraft Server running and use [MC-Sleeping-Server-Starter](https://github.com/vincss/mcsleepingserverstarter), as well as the EmptyServerStopper and EasyWhitelist Plugins. 

Please check the dedicated Backend and Frontend README docs for more details.

## Features

- Minecraft-style interface
- User registration with Minecraft username and error-checking
- Admin authentication and registration (first admin requires no invitation code)
- Admin panel for approving or rejecting users and registering new admins
- Automatic Minecraft server whitelist management through RCON
- Server Status when using [MC-Sleeping-Server-Starter](https://github.com/vincss/mcsleepingserverstarter) (recommended)

## Future Features

* Bedrock support with Floodgate integration
* Microsoft Xbox authentication
* Automatically insert users on the first join
* Server statistics, including graphs
* User group management

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
                      |     (SQLite)     |
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
                        |    Backend   |
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

5. The user's web browser renders the updated UI and makes the website interactive.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/) (20.x or later is recommended, 22.x LTS preferred)
- You have access to a Minecraft server with RCON enabled
- (You have installed [MC-Sleeping-Server-Starter](https://github.com/vincss/mcsleepingserverstarter) on top of your Minecraft server)

## Installation

Generally, you can follow this guideline. More detailed descriptions are in the dedicated Backend and Frontend README docs. 

1. Clone this repository:
```bash
git clone https://github.com/maxonary/convitelist
cd convitelist
```

2. Install the dependencies:
```bash
cd backend
npm install 
cd ../frontend 
npm install
```

3. Copy the `.env.example` files for Back- and Frontend to `.env`:
```bash
# cd into the folders first
cp .env.example .env
```

4. Update the `.env` file with your SQLite database URL, RCON credentials, and other configuration options.

5. Run the database migrations in the backend folder:
```bash
cd backend 
npx prisma migrate deploy
```
or
```bash
cd backend 
npx prisma migrate dev --name init    # for development to create a database
```

6. Generate the Prisma ORM
```bash 
npx prisma generate    # for development to create a database
```

7. Build the code for production (individually):
```bash
npm run build
```

8. Start the production server (individually):
```bash
npm run start
```

The backend application will be available at `http://localhost:3001` 
and the frontend application will be available on a free port (normally `http://localhost:3000`).

## Admin Registration

### First Admin User

After completing the installation and starting the application, register your first admin account:

1. Navigate to the admin registration page (typically at `/admin/register` on your frontend URL)
2. Fill in the registration form:
   - **Username**: Choose a unique username
   - **Password**: Must be at least 8 characters long
   - **Email**: Your email address
3. Click "Register" - **No invitation code is needed for the first admin**

The system automatically detects when no admins exist and allows the first registration without requiring an invitation code.

### Registering Additional Admin Users

For security, additional admin users require an invitation code:

1. **Generate an invitation code** (as an existing admin):
   - Log in to the admin panel
   - Use the API endpoint: `POST /api/invitation/generate-invitation-code`
   - Or run the script: `node backend/src/scripts/testInvitationCode.js`
   - Copy the generated code

2. **Register the new admin**:
   - Navigate to the admin registration page
   - Fill in all fields including the **Invitation Code**
   - Click "Register"

Each invitation code can only be used once. See the [Backend README](backend/README.md) for more detailed instructions.

## Deployment

The recommended way to deploy this application is using Docker and Docker Compose.

1. Clone this repository:
```bash
git clone https://github.com/maxonary/convitelist
cd convitelist
```

2. Create and configure the environment file:
```bash
cp .env.example .env
# Edit .env with your configuration (RCON credentials, API URLs, etc.)
```

3. Deploy using Docker Compose:
```bash
./deploy.sh up
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`

**Environment Variables:**
- `SESSION_SECRET`: A secure random secret key for sessions
- `CLIENT_URL`: The URL where your frontend is hosted
- `RCON_HOST`, `RCON_PORT`, `RCON_PASSWORD`: Minecraft server RCON credentials
- `REACT_APP_API_URL`: Backend API URL (used at build time)
- `REACT_APP_STATUS_API_URL`: MC-Sleeping-Server-Starter API URL
- `REACT_APP_SERVER_NAME`: Your Minecraft server name

**Production Considerations:**
- Set up SSL/HTTPS for production (configure in `nginx/nginx.conf`)
- Consider migrating from SQLite to PostgreSQL for better performance
- Configure regular database backups
- Set up monitoring and health checks (already included in Docker setup)

**Other Commands:**
```bash
./deploy.sh down        # Stop services
./deploy.sh logs        # View logs
./deploy.sh update      # Update and restart
./deploy.sh health      # Check service health
```

## Contributing to Convitelist

We are following the practice of Trunk Based Development.
This means that all changes are made in the `master` branch and deployed to production as soon as they are ready.
On each push to `master`, the application is automatically built and deployed to production using a CI/CD pipeline.

If you want to contribute to this project, please fork the repository and create a pull request. This may not be the best pracitice for Trunk Bases Development, but it is the easiest for us to manage.
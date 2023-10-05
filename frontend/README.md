# Convenient Whitelist for Minecraft Servers Frontend

This application allows admins and moderators to easily manage a whitelist for their Minecraft server.
The Frontend provides a Minecraft title page style interface to be used with the corresponding Backend. 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features

- Minecraft style interface
- User and Admin registration on multiple pages
- Spell check and error handling
- Admin Panel featuring tooltip and other functions

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/) (14.x or later is recommended)
- You have the Backend set-up and running
- You have access to a Minecraft server with RCON enabled

## Installation

1. Navigate into the folder:
```bash
cd convitelist/frontend
```

2. Install the dependencies:
```bash
npm install
```

3. Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API urls and other configuration options.

5. Start the development server:
```bash
npm run dev
```

The application will be available on an avalable port (usually `http://localhost:3001`).

6. Build the application:
```bash
npm run build
```

7. Start the production server:
```bash
npm run start
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

The main title font was generated with [Blockbench](https://web.blockbench.net).
# Convinient Whitelist Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This frontend application allows users to register for a Minecraft server and provides an admin panel for administrators to approve or reject user registrations.

## Technologies

- React
- Axios

### Prerequisites

- Node.js (version 12 or higher)
- npm (version 6 or higher)

### Installation

1. Clone the repository:

2. Change into the project directory:

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
    ```bash
    npm start
    ```
The application should open in your default web browser at http://localhost:3000.

## Configuration

In `src/App.js`, update the `apiUrl` variable with the URL of your backend API:

    ```javascript
    const apiUrl = 'http://localhost:3001'; // Replace with your server URL
    ```

## Deployment

To create an optimised build of the frontend application, run:

```bash
npm run build
```

This will create a `build` directory containing the static files for the frontend application. These files can be served by any web server.

## Usage

### User Registration

Users can register for the Minecraft server by entering their Minecraft username and email address. The user's Minecraft UUID will be retrieved from the Mojang API and stored in the database along with the user's email address.

### Admin Panel

Administrators can view a list of all users who have registered for the Minecraft server. They can approve or reject user registrations. If a user is approved, their Minecraft UUID will be added to the server's whitelist.

## API

The frontend application communicates with the backend API using the following endpoints:

### GET /users

Returns a list of all users who have registered for the Minecraft server.

#### Response

```json
[
  {
    "id": 1,
    "username": "testuser",
    "uuid": "00000000-0000-0000-0000-000000000000",
    "email": "

  }
]
```

### POST /users

Registers a new user for the Minecraft server.

#### Request

```json
{
  "username": "testuser",
  "email": "

}
```

#### Response

```json
{
  "id": 1,
  "username": "testuser",
  "uuid": "00000000-0000-0000-0000-000000000000",
  "email": "

}
```

### PUT /users/:id

Updates a user's registration status.

#### Request

```json
{
  "approved": true
}
```

#### Response

```json
{
  "id": 1,
  "username": "testuser",
  "uuid": "00000000-0000-0000-0000-000000000000",
  "email": "

}
```

### DELETE /users/:id

Deletes a user's registration.

#### Response

```json
{
  "id": 1,
  "username": "testuser",
  "uuid": "00000000-0000-0000-0000-000000000000",
  "email": "

}
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

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

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)


### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

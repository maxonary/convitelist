export const isValidUsername = (username: string) => {
  // Username must be between 3 and 16 characters
  if (username.length < 3 || username.length > 16) {
    return false;
  }

  // Username cannot start or end with an underscore
  if (username.startsWith('_') || username.endsWith('_')) {
    return false;
  }

  // Username cannot have two underscores in a row
  if (username.includes('__')) {
    return false;
  }

  // Username can only contain alphanumeric characters and underscores and spaces
  if (!/^[a-zA-Z0-9_ ]+$/.test(username)) {
    return false;
  }

  return true;
}
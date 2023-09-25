export const isValidUsername = (username: string, gameType: string) => {
  if (username.length < 3 || username.length > 16) {
    return false;
  }

  if ((gameType === 'Java Edition' && username.includes(' ')) || (username.startsWith(' ') || username.endsWith(' '))) {
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
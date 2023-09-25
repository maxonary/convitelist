export const isValidUsername = (username: string, gameType: string) => {
  if (username.length < 3 || username.length > 16) {
    return false;
  }

  if (gameType === 'Java Edition' && username.includes(' ')) {
    return false;
  }

  if (username.startsWith(' ') || username.endsWith(' ')) {
    return false;
  }

  if (!/^[a-zA-Z0-9_ ]+$/.test(username)) {
    return false;
  }

  return true;
}
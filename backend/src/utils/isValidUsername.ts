export const isValidUsername = (username: string, gameType: string) => {
  const regex = gameType === 'Java Edition' ? /^[a-zA-Z0-9_]{3,16}$/ : /^[a-zA-Z0-9_][a-zA-Z0-9_ ]{1,14}[a-zA-Z0-9_]$/;
  return regex.test(username);
}
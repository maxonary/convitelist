export const isValidUsername = (username: string, gameType: string) => {
  const usernamePattern = gameType === 'Java Edition' ? /^\w{3,16}$/ : /^\w[\w ]{1,14}\w$/;
  return usernamePattern.test(username);
}
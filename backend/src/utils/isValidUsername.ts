export const isValidUsername = (username: string, gameType: string) => {
  const regex = gameType === 'Java Edition' ? /^\w{3,16}$/ : /^\w[\w ]{1,14}\w$/;
  return regex.test(username);
}
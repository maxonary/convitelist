const JAVA_EDITION_USERNAME_PATTERN = /^\w{3,16}$/;
const OTHER_EDITION_USERNAME_PATTERN = /^\w[\w ]{1,14}\w$/;

export const isValidUsername = (username: string, gameType: string): boolean => {
  const usernamePattern = gameType === 'Java Edition' ? JAVA_EDITION_USERNAME_PATTERN : OTHER_EDITION_USERNAME_PATTERN;
  return usernamePattern.test(username);
}
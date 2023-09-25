import { expect, test } from 'vitest'
import { isValidUsername } from '../../src/utils/isValidUsername'; // Update with the correct path to your module

test('returns true for valid usernames', () => {
  // Valid usernames for the specified game type
  expect(isValidUsername('Alice123', 'Java Edition')).toBeTruthy();
  expect(isValidUsername('Bob_The_Builder', 'Java Edition')).toBeTruthy();
  expect(isValidUsername('Charlie', 'Bedrock Edition')).toBeTruthy();
  expect(isValidUsername('David_ 123', 'Bedrock Edition')).toBeTruthy();
});

test('returns false for usernames that are too short or too long', () => {
  // Usernames with length less than 3 or greater than 16 characters
  expect(isValidUsername('a', 'Java Edition')).toBeFalsy();
  expect(isValidUsername('ThisIsAReallyLongUsername', 'Java Edition')).toBeFalsy();
});

test('returns false for usernames with spaces or leading/trailing spaces in Java Edition', () => {
  // Usernames with spaces or leading/trailing spaces in Java Edition
  expect(isValidUsername('User Name', 'Java Edition')).toBeFalsy();
  expect(isValidUsername(' LeadingSpace', 'Java Edition')).toBeFalsy();
  expect(isValidUsername('TrailingSpace ', 'Java Edition')).toBeFalsy();
});

test('returns false for usernames with double underscores', () => {
  // Usernames with double underscores
  expect(isValidUsername('Alice__123', 'Java Edition')).toBeFalsy();
  expect(isValidUsername('Bob__', 'Java Edition')).toBeFalsy();
});

test('returns false for usernames with invalid characters', () => {
  // Usernames with invalid characters (non-alphanumeric, non-underscore, non-space)
  expect(isValidUsername('Alice$123', 'Java Edition')).toBeFalsy();
  expect(isValidUsername('Bob@Builder', 'Java Edition')).toBeFalsy();
});

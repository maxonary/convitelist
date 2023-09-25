import { expect, test } from 'vitest'
import { isValidUsername } from '../../src/utils/isValidUsername';

test('returns true for valid usernames', () => {
  expect(isValidUsername('Alice123', 'Java Edition')).toBeTruthy();
  expect(isValidUsername('Bob_The_Builder', 'Java Edition')).toBeTruthy();
  expect(isValidUsername('Charlie', 'Bedrock Edition')).toBeTruthy();
  expect(isValidUsername('David_ 123', 'Bedrock Edition')).toBeTruthy();
});

test('returns false for usernames that are too short or too long', () => {
  expect(isValidUsername('a', 'Java Edition')).toBeFalsy();
  expect(isValidUsername('ThisIsAReallyLongUsername', 'Java Edition')).toBeFalsy();
});

test('returns false for usernames with spaces or leading/trailing spaces in Java Edition', () => {
  expect(isValidUsername('User Name', 'Java Edition')).toBeFalsy();
  expect(isValidUsername(' LeadingSpace', 'Java Edition')).toBeFalsy();
  expect(isValidUsername('TrailingSpace ', 'Java Edition')).toBeFalsy();
  expect(isValidUsername('Trailing Spaces', 'Bedrock Edition')).toBeTruthy();
});

test('returns false for usernames with invalid characters', () => {
  expect(isValidUsername('Alice$123', 'Java Edition')).toBeFalsy();
  expect(isValidUsername('Bob@Builder', 'Java Edition')).toBeFalsy();
});

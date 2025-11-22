
import { PasswordOptions } from '../types';
import { LOWERCASE_CHARS, UPPERCASE_CHARS, NUMBER_CHARS, SYMBOL_CHARS } from '../constants';

export const generatePassword = (options: PasswordOptions, length: number): string => {
  let charset = '';
  if (options.includeLowercase) charset += LOWERCASE_CHARS;
  if (options.includeUppercase) charset += UPPERCASE_CHARS;
  if (options.includeNumbers) charset += NUMBER_CHARS;
  if (options.includeSymbols) charset += SYMBOL_CHARS;

  if (charset === '') {
    // Default to lowercase if no options are selected to avoid errors
    charset = LOWERCASE_CHARS;
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

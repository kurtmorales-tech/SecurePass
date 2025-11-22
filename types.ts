
export interface PasswordOptions {
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export interface Credential {
  id: string;
  label: string;
  category: string;
  password: string;
  createdAt: string;
}

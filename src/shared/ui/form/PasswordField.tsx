import React from 'react';

import { TextField, type TextFieldProps } from './TextField';

export const PasswordField = (props: TextFieldProps) => (
  <TextField {...props} secureTextEntry autoCapitalize="none" />
);

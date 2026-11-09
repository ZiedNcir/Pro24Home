import React from 'react';

import { TextField, type TextFieldProps } from './TextField';

export const PhoneField = (props: TextFieldProps) => (
  <TextField {...props} keyboardType="phone-pad" textContentType="telephoneNumber" />
);

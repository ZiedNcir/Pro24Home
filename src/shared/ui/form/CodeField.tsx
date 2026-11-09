import React from 'react';

import { TextField, type TextFieldProps } from './TextField';

export const CodeField = (props: TextFieldProps) => (
  <TextField
    {...props}
    autoCapitalize="characters"
    autoCorrect={false}
    maxLength={props.maxLength || 6}
    textContentType="oneTimeCode"
  />
);

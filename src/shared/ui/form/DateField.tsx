import React from 'react';

import { TextField, type TextFieldProps } from './TextField';

export const DateField = (props: TextFieldProps) => (
  <TextField {...props} editable={false} />
);

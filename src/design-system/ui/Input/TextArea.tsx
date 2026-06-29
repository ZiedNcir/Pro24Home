import React from 'react';
import { TextInput, TextInputProps } from './TextInput';

export const TextArea: React.FC<TextInputProps> = (props) => (
  <TextInput
    {...props}
    multiline
    textAlignVertical="top"
    style={[{ minHeight: 120, paddingTop: 14 }, props.style]}
  />
);

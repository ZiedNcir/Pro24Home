import React from 'react';
import { colors } from '../../foundations';
import { Icon } from '../../icons';
import { TextInput, TextInputProps } from './TextInput';

export const PhoneInput: React.FC<TextInputProps> = (props) => (
  <TextInput
    {...props}
    keyboardType="phone-pad"
    textContentType="telephoneNumber"
    autoComplete="tel"
    leftIcon={props.leftIcon ?? <Icon name="phone" size="sm" color={colors.gray[500]} />}
  />
);

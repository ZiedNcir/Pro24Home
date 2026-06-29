import React from 'react';
import { colors } from '../../foundations';
import { Icon } from '../../icons';
import { TextInput, TextInputProps } from './TextInput';

export const SearchInput: React.FC<TextInputProps> = (props) => (
  <TextInput
    {...props}
    returnKeyType="search"
    placeholder={props.placeholder ?? 'Rechercher'}
    leftIcon={props.leftIcon ?? <Icon name="search" size="sm" color={colors.gray[500]} />}
  />
);

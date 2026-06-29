import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { colors } from '../../foundations';
import { Icon } from '../../icons';
import { TextInput, TextInputProps } from './TextInput';

export const PasswordInput: React.FC<TextInputProps> = (props) => {
  const [visible, setVisible] = useState(false);

  return (
    <TextInput
      {...props}
      secureTextEntry={!visible}
      rightIcon={
        <Pressable onPress={() => setVisible((current) => !current)}>
          <Icon name={visible ? 'eyeOff' : 'eye'} size="sm" color={colors.gray[500]} />
        </Pressable>
      }
    />
  );
};

import React from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';

import Field from '@components/Field';

export interface OtpCodeInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  helperText?: string;
}

export const OtpCodeInput = <T extends FieldValues>({
  control,
  name,
  label,
  helperText,
}: OtpCodeInputProps<T>) => (
  <Field
    control={control}
    name={name}
    label={label}
    code
    required
    numeric
    maxLength={6}
    helperText={helperText}
    keyboardType="number-pad"
    textContentType="oneTimeCode"
  />
);

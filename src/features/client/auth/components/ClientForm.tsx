import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { UseFormReturn } from 'react-hook-form';

import Field from '@components/Field';
import { spacing } from '../../../../design-system';
import { t } from '../../../../translations/i18n';
import { FormSection } from './FormSection';

export interface ClientRegisterFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  postal_code: string;
  password: string;
  password_confirmation: string;
}

export interface ClientFormProps {
  form: UseFormReturn<ClientRegisterFormValues>;
}

export const ClientForm: React.FC<ClientFormProps> = ({ form }) => {
  const { control, getValues } = form;

  return (
    <>
      <FormSection
        icon="user"
        title={t('module1.register.identity.title')}
        subtitle={t('module1.register.identity.subtitle')}
      >
        <View style={styles.row}>
          <Field
            control={control}
            name="first_name"
            label={t('module1.register.firstNameLabel')}
            placeholder={t('module1.register.firstNamePlaceholder')}
            required
            containerStyle={styles.flex}
          />

          <Field
            control={control}
            name="last_name"
            label={t('module1.register.lastNameLabel')}
            placeholder={t('module1.register.lastNamePlaceholder')}
            required
            containerStyle={styles.flex}
          />
        </View>
      </FormSection>

      <FormSection
        icon="phone"
        title={t('module1.register.contact.title')}
        subtitle={t('module1.register.contact.subtitle')}
      >
        <Field
          control={control}
          name="email"
          label={t('module1.register.emailLabel')}
          placeholder={t('module1.register.emailPlaceholder')}
          required
          email
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Field
          control={control}
          name="phone_number"
          label={t('module1.register.phoneLabel')}
          placeholder={t('module1.register.phonePlaceholder')}
          required
          isPhone
        />

        <Field
          control={control}
          name="address"
          label={t('module1.register.addressLabel')}
          placeholder={t('module1.register.addressPlaceholder')}
          required
        />

        <Field
          control={control}
          name="postal_code"
          label={t('module1.register.postalCodeLabel')}
          placeholder={t('module1.register.postalCodePlaceholder')}
          required
          numeric
          keyboardType="number-pad"
        />
      </FormSection>

      <FormSection
        icon="lock"
        title={t('module1.register.security.title')}
        subtitle={t('module1.register.security.subtitle')}
      >
        <Field
          control={control}
          name="password"
          label={t('module1.register.passwordLabel')}
          placeholder={t('module1.register.passwordPlaceholder')}
          required
          password
        />

        <Field
          control={control}
          name="password_confirmation"
          label={t('module1.register.confirmPasswordLabel')}
          placeholder={t('module1.register.confirmPasswordPlaceholder')}
          required
          password
          validate={(value) =>
            value === getValues('password') ||
            t('module1.register.errors.passwordMismatch')
          }
        />
      </FormSection>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  flex: {
    flex: 1,
  },
});

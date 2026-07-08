import React from 'react';
import type { UseFormReturn } from 'react-hook-form';

import Field from '@components/Field';
import { t } from '../../../../translations/i18n';
import type { Service } from '../../../../store/api/api.types';
import { FormSection } from './FormSection';
import { ServicePicker } from './ServicePicker';

export interface ProfessionalRegisterFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  postal_code: string;
  password: string;
  password_confirmation: string;
  company_name: string;
  siret_number: string;
  services: number[];
}

export interface ProfessionalFormProps {
  form: UseFormReturn<ProfessionalRegisterFormValues>;
  services: Service[];
  servicesError?: string;
}

export const ProfessionalForm: React.FC<ProfessionalFormProps> = ({
  form,
  services,
  servicesError,
}) => {
  const { control, getValues, setValue, watch } = form;
  const selectedServices = watch('services') || [];

  const toggleService = (serviceId: number) => {
    const next = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId];

    setValue('services', next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      <FormSection
        icon="user"
        title={t('module1.professional.identity.title')}
        subtitle={t('module1.professional.identity.subtitle')}
      >
        <Field
          control={control}
          name="first_name"
          label={t('module1.register.firstNameLabel')}
          placeholder={t('module1.register.firstNamePlaceholder')}
          required
        />

        <Field
          control={control}
          name="last_name"
          label={t('module1.register.lastNameLabel')}
          placeholder={t('module1.register.lastNamePlaceholder')}
          required
        />

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
      </FormSection>

      <FormSection
        icon="tools"
        title={t('module1.professional.company.title')}
        subtitle={t('module1.professional.company.subtitle')}
      >
        <Field
          control={control}
          name="company_name"
          label={t('module1.professional.companyNameLabel')}
          placeholder={t('module1.professional.companyNamePlaceholder')}
          required
        />

        <Field
          control={control}
          name="siret_number"
          label={t('module1.professional.siretLabel')}
          placeholder={t('module1.professional.siretPlaceholder')}
          required
          numeric
          keyboardType="number-pad"
          maxLength={14}
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
        icon="tools"
        title={t('module1.professional.services.title')}
        subtitle={t('module1.professional.services.subtitle')}
      >
        <ServicePicker
          services={services}
          selectedIds={selectedServices}
          error={servicesError}
          onToggle={toggleService}
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

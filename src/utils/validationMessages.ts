// utils/validationMessages.ts
export const getValidationMessages = (t: (key: string) => string) => ({
    firstName: {
        required: t('ui.form.firstName.required'),
        minLength: t('ui.form.firstName.minLength'),
        maxLength: t('ui.form.firstName.maxLength'),
    },
    lastName: {
        required: t('ui.form.lastName.required'),
        minLength: t('ui.form.lastName.minLength'),
        maxLength: t('ui.form.lastName.maxLength'),
    },
    email: {
        required: t('ui.form.email.required'),
        invalid: t('ui.form.email.invalid'),
    },
    password: {
        required: t('ui.form.password.required'),
        minLength: t('ui.form.password.minLength'),
        requirements: t('ui.form.password.requirements'),
    },
    phone: {
        required: t('ui.form.phone.required'),
        invalid: t('ui.form.phone.invalid'),
    },
    address: {
        required: t('ui.form.address.required'),
        minLength: t('ui.form.address.minLength'),
    },
    postalCode: {
        required: t('ui.form.postCode.required'),
        invalid: t('ui.form.postCode.invalid'),
    },
    passwordConfirm: {
        required: t('ui.form.passwordConfirm.required'),
        match: t('ui.form.passwordConfirm.match'),
    },
});
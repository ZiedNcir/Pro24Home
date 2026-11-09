import { Toast } from 'react-native-toast-notifications';

type MessageOptions = { placement?: 'top' | 'bottom' };

const show = (message: string, type: 'success' | 'danger' | 'warning', options?: MessageOptions) =>
  Toast.show(message, { type, placement: options?.placement || 'bottom' });

export const showSuccess = (message: string, options?: MessageOptions) => show(message, 'success', options);
export const showError = (message: string, options?: MessageOptions) => show(message, 'danger', options);
export const showWarning = (message: string, options?: MessageOptions) => show(message, 'warning', options);

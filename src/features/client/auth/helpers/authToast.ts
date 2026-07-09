export const showAuthErrorToast = (
  toast: any,
  message: string,
) => {
  toast.show(message, {
    type: 'danger',
    placement: 'bottom',
    duration: 4000,
  });
};

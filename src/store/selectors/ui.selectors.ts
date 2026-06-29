import type { RootState } from '../index';

export const selectUiState = (state: RootState) => state.ui;

export const selectTheme = (state: RootState) =>
  state.ui.theme;

export const selectIsDarkMode = (state: RootState) =>
  state.ui.isDarkMode;

export const selectLanguage = (state: RootState) =>
  state.ui.language;

export const selectIsRTL = (state: RootState) =>
  state.ui.isRTL;

export const selectIsLoading = (state: RootState) =>
  state.ui.isLoading;

export const selectLoadingText = (state: RootState) =>
  state.ui.loadingText;

export const selectToast = (state: RootState) =>
  state.ui.toast;

export const selectIsToastVisible = (state: RootState) =>
  state.ui.toast.show;

export const selectModal = (state: RootState) =>
  state.ui.modal;

export const selectIsModalOpen =
  (type?: string) =>
  (state: RootState) =>
    state.ui.modal.show && (!type || state.ui.modal.type === type);

export const selectBottomSheet = (state: RootState) =>
  state.ui.bottomSheet;

export const selectIsBottomSheetOpen =
  (type?: string) =>
  (state: RootState) =>
    state.ui.bottomSheet.show && (!type || state.ui.bottomSheet.type === type);

export const selectIsNetworkConnected = (state: RootState) =>
  state.ui.isNetworkConnected;

export const selectIsOnline = (state: RootState) =>
  state.ui.isOnline;

export const selectNavigation = (state: RootState) =>
  state.ui.navigation;

export const selectCurrentRoute = (state: RootState) =>
  state.ui.navigation.currentRoute;

export const selectPreviousRoute = (state: RootState) =>
  state.ui.navigation.previousRoute;

export const selectRouteParams = (state: RootState) =>
  state.ui.navigation.params;

export const selectLayout = (state: RootState) =>
  state.ui.layout;

export const selectSafeArea = (state: RootState) =>
  state.ui.layout.safeArea;

export const selectKeyboardVisible = (state: RootState) =>
  state.ui.layout.keyboardVisible;

export const selectKeyboardHeight = (state: RootState) =>
  state.ui.layout.keyboardHeight;

export const selectErrors = (state: RootState) =>
  state.ui.errors;

export const selectGlobalError = (state: RootState) =>
  state.ui.errors.globalError;

export const selectValidationErrors = (state: RootState) =>
  state.ui.errors.validationErrors;

export const selectValidationError =
  (field: string) =>
  (state: RootState) =>
    state.ui.errors.validationErrors[field]?.[0] ?? null;

export const selectVersion = (state: RootState) =>
  state.ui.version;

export const selectIsUpdateAvailable = (state: RootState) =>
  state.ui.version.updateAvailable;

export const selectIsForceUpdate = (state: RootState) =>
  state.ui.version.forceUpdate;

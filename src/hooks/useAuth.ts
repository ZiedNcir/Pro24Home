import { useCallback } from 'react';

import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterClientMutation,
  useRegisterProfessionalMutation,
  useVerifyAccountMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '../store/api';

import { useAppSelector } from '../store/hooks';
import {
  selectAuthError,
  selectAuthLoading,
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsClient,
  selectIsProfessional,
  selectUserType,
} from '../store/selectors';

import {
  buildClientRegisterPayload,
  buildProfessionalRegisterPayload,
  validateClientRegister,
  validateProfessionalRegister,
} from '../services/auth';

import type {
  LoginRequest,
  RegisterClientRequest,
  RegisterProfessionalRequest,
  VerificationRequest,
} from '../store/api/api.types';

export const useAuth = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userType = useAppSelector(selectUserType);
  const isClient = useAppSelector(selectIsClient);
  const isProfessional = useAppSelector(selectIsProfessional);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [loginMutation, loginState] = useLoginMutation();
  const [logoutMutation, logoutState] = useLogoutMutation();
  const [registerClientMutation, registerClientState] = useRegisterClientMutation();
  const [registerProfessionalMutation, registerProfessionalState] = useRegisterProfessionalMutation();
  const [verifyAccountMutation, verifyAccountState] = useVerifyAccountMutation();
  const [resendVerificationMutation, resendVerificationState] = useResendVerificationMutation();
  const [forgotPasswordMutation, forgotPasswordState] = useForgotPasswordMutation();
  const [resetPasswordMutation, resetPasswordState] = useResetPasswordMutation();
  const [changePasswordMutation, changePasswordState] = useChangePasswordMutation();
  const [updateProfileMutation, updateProfileState] = useUpdateProfileMutation();

  const login = useCallback(
    (credentials: LoginRequest) => loginMutation(credentials).unwrap(),
    [loginMutation],
  );

  const registerClient = useCallback(
    (payload: RegisterClientRequest) => {
      const validation = validateClientRegister(payload);
      if (!validation.valid) {
        return Promise.reject(validation.errors);
      }

      return registerClientMutation(buildClientRegisterPayload(payload)).unwrap();
    },
    [registerClientMutation],
  );

  const registerProfessional = useCallback(
    (payload: RegisterProfessionalRequest) => {
      const validation = validateProfessionalRegister(payload);
      if (!validation.valid) {
        return Promise.reject(validation.errors);
      }

      return registerProfessionalMutation(buildProfessionalRegisterPayload(payload)).unwrap();
    },
    [registerProfessionalMutation],
  );

  const verifyAccount = useCallback(
    (payload: VerificationRequest) => verifyAccountMutation(payload).unwrap(),
    [verifyAccountMutation],
  );

  const logout = useCallback(
    () => logoutMutation().unwrap(),
    [logoutMutation],
  );

  return {
    currentUser,
    isAuthenticated,
    userType,
    isClient,
    isProfessional,
    isLoading,
    error,

    login,
    logout,
    registerClient,
    registerProfessional,
    verifyAccount,
    resendVerification: resendVerificationMutation,
    forgotPassword: forgotPasswordMutation,
    resetPassword: resetPasswordMutation,
    changePassword: changePasswordMutation,
    updateProfile: updateProfileMutation,

    loginState,
    logoutState,
    registerClientState,
    registerProfessionalState,
    verifyAccountState,
    resendVerificationState,
    forgotPasswordState,
    resetPasswordState,
    changePasswordState,
    updateProfileState,
    useGetProfileQuery,
  };
};

// src/hooks/useAuth.ts

import { RootState, useAppSelector } from '@store/index';

export const useAuth = () => {
    const currentUser = useAppSelector(
        (state: RootState) => state.auth.user
    );
    console.log('useAuth - currentUser:', currentUser);
    return {
        user: currentUser,
        type: currentUser?.type,
        isLogged: !!currentUser,
    };
};
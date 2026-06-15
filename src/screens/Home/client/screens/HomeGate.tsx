// src/navigations/HomeGate.tsx

import React from 'react';
import styled from 'styled-components/native';

import ScreenContainer from '@components/ScreenContainer';

import { Colors } from '@utils/constant';
import { useAuth } from '@hooks/useAuth';
import ClientHome from './HomeClient';

export const HomeGate: React.FC = () => {

    const { type } = useAuth();



    // 🚨 Safety fallback
    if (!type) {
        return (
            <ScreenContainer mode="light" centered>
                <ErrorText>Invalid user type</ErrorText>
            </ScreenContainer>
        );
    }

    // 🔀 Routing logic
    switch (type) {
        case 'professional':
            return null;

        case 'client':
        default:
            return <ClientHome />;
    }
};


const ErrorText = styled.Text`
  color: ${Colors.black};
  font-size: 16px;
`;
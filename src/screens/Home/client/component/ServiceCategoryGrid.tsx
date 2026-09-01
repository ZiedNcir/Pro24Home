// components/ServiceCategoryGrid.tsx

import React from 'react';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { verticalScale, } from '@utils/normalizedCss';
import CardService from './CardService';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackType } from '../../../../navigation/constant/core';

const services = [
    {
        id: 0,
        title: 'Fenêtre & Vitrerie',
        description: 'Réparation et installation',
        image: require('@assets/images/fenetre.png'),
    },
    {
        id: 1,
        title: 'Électricien',
        description: 'Dépannage \n. électrique',
        image: require('@assets/images/electricien.png'),
    },
    {
        id: 2,
        title: 'Plomberie',
        description: 'Fuites, chauffage',
        image: require('@assets/images/chauffagiste.png'),
    },
    {
        id: 3,
        title: 'Serrurerie',
        description: 'Ouverture de porte',
        image: require('@assets/images/serrurier.png'),
    },
];

const ServiceCategoryGrid = () => {
    const navigation = useNavigation();
    const appNavigation = navigation as unknown as NativeStackNavigationProp<AppStackType>;


    return (
        <Wrapper>
            <Header>
                <Text variant="bold">Catégories de services</Text>
            </Header>

            <Grid>
                {services.map(item => (
                    <CardService
                        key={item.id}
                        title={item.title}
                        image={item.image}
                        description={item.description}
                        onClick={() =>
                            appNavigation.navigate('NewIntervention', {
                                service_id: item.id,
                                service_name: item.title,
                            })
                        }
                    />
                ))}
            </Grid>
        </Wrapper>
    );
};

export default ServiceCategoryGrid;

const Wrapper = styled.View``;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${verticalScale(12)}px;
`;

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

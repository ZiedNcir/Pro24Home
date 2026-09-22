// components/ServiceCategoryGrid.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { verticalScale, } from '@utils/normalizedCss';
import CardService from '@entities/service/ui/CardService';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackType } from '../../../../navigation/constant/core';

const services = [
    {
        id: 0,
        titleKey: 'client.home.window',
        descriptionKey: 'client.home.windowDescription',
        image: require('@assets/images/fenetre.png'),
    },
    {
        id: 1,
        titleKey: 'client.home.electrician',
        descriptionKey: 'client.home.electricianDescription',
        image: require('@assets/images/electricien.png'),
    },
    {
        id: 2,
        titleKey: 'services.plumbing',
        descriptionKey: 'client.home.plumbingDescription',
        image: require('@assets/images/chauffagiste.png'),
    },
    {
        id: 3,
        titleKey: 'services.locksmith',
        descriptionKey: 'client.home.locksmithDescription',
        image: require('@assets/images/serrurier.png'),
    },
];

const ServiceCategoryGrid = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const appNavigation = navigation as unknown as NativeStackNavigationProp<AppStackType>;


    return (
        <Wrapper>
            <Header>
                <Text variant="bold">{t('client.home.categories')}</Text>
            </Header>

            <Grid>
                {services.map(item => (
                    <CardService
                        key={item.id}
                        title={t(item.titleKey)}
                        image={item.image}
                        description={t(item.descriptionKey)}
                        onClick={() =>
                            appNavigation.navigate('NewIntervention', {
                                service_id: item.id,
                                service_name: t(item.titleKey),
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

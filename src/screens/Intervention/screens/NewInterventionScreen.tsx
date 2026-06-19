import React, { useState } from 'react';
import styled from 'styled-components/native';

import ScreenContainer from '@components/ScreenContainer';
import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import { Colors } from '@utils/constant';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';

import InterventionHeader from '../components/InterventionHeader';
import StepProgress from '../components/StepProgress';
import BottomActions from '../components/BottomActions';
import SelectableCard from '../components/SelectableCard';
import ServiceSummaryCard from '../components/ServiceSummaryCard';
import PhotoPickerRow from '../components/PhotoPickerRow';
import AddressCard from '../components/AddressCard';
import InfoNotice from '../components/InfoNotice';
import { InterventionStep } from './types';
import { colors } from '@theme/index';
import { useNavigation } from '@react-navigation/core';

const interventionTypes = [
    {
        id: 1,
        title: 'Dépannage électrique',
        description: 'Problème de courant, prise, disjoncteur, court-circuit...',
        icon: 'fa-bolt',
    },
    {
        id: 2,
        title: 'Installation électrique',
        description: 'Installation de nouveaux équipements, prises, luminaires...',
        icon: 'fa-plug',
    },
    {
        id: 3,
        title: 'Mise aux normes',
        description: 'Mise en conformité de votre installation électrique',
        icon: 'fa-building',
    },
    {
        id: 4,
        title: 'Autre demande',
        description: 'Autre type d’intervention électrique',
        icon: 'fa-lightbulb',
    },
];

export const NewInterventionScreen = () => {
    const [step, setStep] = useState<InterventionStep>(1);
    const [selectedType, setSelectedType] = useState(1);
    const [selectedTiming, setSelectedTiming] = useState('asap');
    const [selectedAddress, setSelectedAddress] = useState(1);
    const navigation = useNavigation();


    const goNext = () => {
        if (step < 4) {
            setStep((step + 1) as InterventionStep);
            return;
        }

        //('PriceEstimation');
    };

    const goPrevious = () => {
        if (step > 1) {
            setStep((step - 1) as InterventionStep);
        }
    };

    return (
        <ScreenContainer
            mode="light"
            scrollable
            paddingHorizontal={horizontalScale(18)}
            paddingVertical={verticalScale(12)}
            contentContainerStyle={{ paddingBottom: verticalScale(30) }}
        >
            <InterventionHeader />
            <StepProgress currentStep={step} />

            {step === 1 ? (
                <>
                    <ServiceSummaryCard
                        title="Électricien"
                        description="Dépannage et installation électrique"
                        image={require('@assets/images/electricien.png')}
                    />

                    <SectionTitle>Quel est le type d’intervention ?</SectionTitle>

                    {interventionTypes.map(item => (
                        <SelectableCard
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            icon={item.icon}
                            selected={selectedType === item.id}
                            onPress={() => setSelectedType(item.id)}
                        />
                    ))}

                    <InfoNotice
                        icon="fa-shield-alt"
                        title="Professionnels qualifiés et vérifiés"
                        description="Nos électriciens sont notés et évalués par nos clients."
                    />

                    <BottomActions primaryTitle="Continuer" onPrimaryPress={goNext} />
                </>
            ) : null}

            {step === 2 ? (
                <>
                    <SectionTitle>Décrivez votre problème</SectionTitle>
                    <InputBox
                        multiline
                        placeholder="La prise du salon ne fonctionne plus depuis hier..."
                        placeholderTextColor="#8A8A8A"
                    />

                    <SectionTitle>Ajoutez des photos (optionnel)</SectionTitle>
                    <PhotoPickerRow />

                    <SectionTitle>Quand souhaitez-vous l’intervention ?</SectionTitle>

                    <SelectableCard
                        title="Dès que possible"
                        description="Dans les prochaines 24h"
                        icon="fa-clock"
                        selected={selectedTiming === 'asap'}
                        onPress={() => setSelectedTiming('asap')}
                    />

                    <SelectableCard
                        title="Choisir une date et heure"
                        description="Sélectionnez un créneau"
                        icon="fa-calendar"
                        selected={selectedTiming === 'schedule'}
                        onPress={() => setSelectedTiming('schedule')}
                    />

                    <BottomActions
                        primaryTitle="Continuer"
                        onPrimaryPress={goNext}
                        onSecondaryPress={goPrevious}
                    />
                </>
            ) : null}

            {step === 3 ? (
                <>
                    <SectionTitle>Où doit avoir lieu l’intervention ?</SectionTitle>

                    <SmallLabel>Adresse enregistrée</SmallLabel>

                    <AddressCard
                        title="123 Rue de la Paix, 75001 Paris"
                        details="Appartement, étage 2, code 1234B"
                        selected={selectedAddress === 1}
                        isDefault
                        onPress={() => setSelectedAddress(1)}
                    />

                    <SmallLabel>Autres adresses</SmallLabel>

                    <AddressCard
                        title="Bureau"
                        details="45 Avenue des Champs-Élysées, 75008 Paris"
                        selected={selectedAddress === 2}
                        onPress={() => setSelectedAddress(2)}
                    />

                    <AddAddressButton onPress={() => { navigation.navigate("AddAddress" as never) }


                    }>
                        <SvgIcon name="fa-user-plus" size={14} color={colors.primary} />
                        <Text variant="bold" color="primary" fontSize={13}>
                            Ajouter une nouvelle adresse
                        </Text>
                    </AddAddressButton>

                    <BottomActions
                        primaryTitle="Continuer"
                        onPrimaryPress={goNext}
                        onSecondaryPress={goPrevious}
                    />
                </>
            ) : null}

            {step === 4 ? (
                <>
                    <SectionTitle>Récapitulatif de votre demande</SectionTitle>

                    <SummaryBlock>
                        <SummaryLine title="Service" value="Électricien" />
                        <SummaryLine
                            title="Détails"
                            value="La prise du salon ne fonctionne plus depuis hier."
                        />
                        <SummaryLine
                            title="Adresse"
                            value="Maison secondaire, 10 Allée des Acacias"
                        />
                        <SummaryLine title="Date souhaitée" value="Dès que possible" />
                    </SummaryBlock>

                    <EstimationBox>
                        <Text variant="bold" color="black" fontSize={14}>
                            Estimation du prix
                        </Text>

                        <Text
                            variant="bold"
                            color="black"
                            fontSize={18}
                            style={{ marginTop: verticalScale(6) }}
                        >
                            À partir de 50 €
                        </Text>

                        <Text
                            variant="regularSmall"
                            color="gray600"
                            style={{ marginTop: verticalScale(6) }}
                        >
                            Le prix final sera confirmé par le professionnel après diagnostic.
                        </Text>
                    </EstimationBox>

                    <BottomActions
                        primaryTitle="Voir le prix moyen"
                        onPrimaryPress={() => { }//appNavigate('PriceEstimation')

                        }
                        onSecondaryPress={goPrevious}
                    />
                </>
            ) : null}
        </ScreenContainer>
    );
};


const SectionTitle = styled(Text).attrs({
    variant: 'bold',
    color: 'black',
    fontSize: 15,
})`
  margin-bottom: ${verticalScale(12)}px;
  margin-top: ${verticalScale(12)}px;
`;

const SmallLabel = styled(Text).attrs({
    variant: 'bold',
    color: 'black',
    fontSize: 12,
})`
  margin-bottom: ${verticalScale(8)}px;
`;

const InputBox = styled.TextInput`
  height: ${verticalScale(110)}px;
  border-width: 1px;
  border-color: #e5e5e5;
  border-radius: 12px;
  padding: ${horizontalScale(14)}px;
  text-align-vertical: top;
  background-color: ${Colors.white};
`;

const AddAddressButton = styled.TouchableOpacity`
  height: ${verticalScale(48)}px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${colors.primary};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: ${horizontalScale(8)}px;
  margin-top: ${verticalScale(10)}px;
`;

const SummaryBlock = styled.View`
  background-color: ${colors.white};
  border-radius: 14px;
  border-width: 1px;
  border-color: #eeeeee;
  padding: ${horizontalScale(14)}px;
`;

const EstimationBox = styled.View`
  background-color: #fff1e8;
  border-radius: 14px;
  padding: ${horizontalScale(14)}px;
  margin-top: ${verticalScale(14)}px;
`;

const SummaryLine = ({ title, value }: { title: string; value: string }) => (
    <SummaryLineWrapper>
        <Text variant="bold" color="black" fontSize={12}>
            {title}
        </Text>
        <Text variant="regularSmall" color="gray600" style={{ marginTop: 4 }}>
            {value}
        </Text>
    </SummaryLineWrapper>
);

const SummaryLineWrapper = styled.View`
  margin-bottom: ${verticalScale(12)}px;
`;
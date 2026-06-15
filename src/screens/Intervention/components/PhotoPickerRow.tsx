// src/screens/intervention/components/PhotoPickerRow.tsx

import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import { Colors } from '@utils/constant';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
} from '@utils/normalizedCss';

const photos = [
    require('@assets/images/fenetre.png'),
    require('@assets/images/fenetre.png'),
    require('@assets/images/fenetre.png'),
];

const PhotoPickerRow = () => {
    return (
        <Row>
            {photos.map((photo, index) => (
                <PhotoBox key={index}>
                    <Photo source={photo} resizeMode="cover" />
                </PhotoBox>
            ))}

            <AddButton>
                <SvgIcon name="fa-camera" size={18} color={Colors.black} />
                <Text variant="notification" color="black" style={{ marginTop: 4 }}>
                    Ajouter
                </Text>
            </AddButton>
        </Row>
    );
};

export default PhotoPickerRow;

const Row = styled.View`
  flex-direction: row;
  gap: ${horizontalScale(10)}px;
  margin-bottom: ${verticalScale(12)}px;
`;

const PhotoBox = styled.View`
  width: ${horizontalScale(64)}px;
  height: ${horizontalScale(64)}px;
  border-radius: ${moderateScale(10)}px;
  overflow: hidden;
  background-color: #f3f3f3;
`;

const Photo = styled(Image)`
  width: 100%;
  height: 100%;
`;

const AddButton = styled.TouchableOpacity`
  width: ${horizontalScale(64)}px;
  height: ${horizontalScale(64)}px;
  border-radius: ${moderateScale(10)}px;
  border-width: 1px;
  border-color: #dddddd;
  background-color: ${Colors.white};
  justify-content: center;
  align-items: center;
`;
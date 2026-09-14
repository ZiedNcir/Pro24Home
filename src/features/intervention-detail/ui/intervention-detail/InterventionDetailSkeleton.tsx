import React from 'react';
import styled from 'styled-components/native';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import InterventionHeader from '@shared/ui/navigation/InterventionHeader';
import { colors } from '@theme/index';
import { moderateScale, verticalScale } from '@utils/normalizedCss';

const InterventionDetailSkeleton = () => (
    <ScreenContainer mode="light" scrollable paddingHorizontal={18} paddingVertical={12}>
        <InterventionHeader title="Détail de l’intervention" showHelp={false} />
        <StatusSkeleton />
        <TitleSkeleton />
        <SectionSkeleton>
            <LineSkeleton width="42%" height={16} />
            <LineSkeleton width="100%" height={13} />
            <LineSkeleton width="78%" height={13} />
        </SectionSkeleton>
        <SectionSkeleton>
            <LineSkeleton width="38%" height={16} />
            <LineSkeleton width="92%" height={13} />
            <LineSkeleton width="70%" height={13} />
        </SectionSkeleton>
        <MapSkeleton />
    </ScreenContainer>
);

export default InterventionDetailSkeleton;

const SkeletonBlock = styled.View<{ width?: string; height?: number }>`
  width: ${({ width = '100%' }) => width};
  height: ${({ height = 12 }) => height}px;
  border-radius: ${moderateScale(7)}px;
  background-color: #e9e9e9;
`;

const StatusSkeleton = styled(SkeletonBlock).attrs({ width: '28%', height: 30 })`
  margin-top: ${verticalScale(18)}px;
`;

const TitleSkeleton = styled(SkeletonBlock).attrs({ width: '72%', height: 25 })`
  margin-top: ${verticalScale(14)}px;
`;

const SectionSkeleton = styled.View`
  padding: ${verticalScale(16)}px;
  margin-top: ${verticalScale(16)}px;
  border-radius: ${moderateScale(14)}px;
  border-width: 1px;
  border-color: #eeeeee;
  background-color: ${colors.white};
  gap: ${verticalScale(10)}px;
`;

const LineSkeleton = styled(SkeletonBlock)<{ width: string }>`
  margin-bottom: ${verticalScale(2)}px;
`;

const MapSkeleton = styled(SkeletonBlock).attrs({ width: '100%', height: 190 })`
  margin-top: ${verticalScale(16)}px;
  border-radius: ${moderateScale(14)}px;
`;

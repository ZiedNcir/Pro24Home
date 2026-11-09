import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import InterventionHeader from '@shared/ui/navigation/InterventionHeader';
import { verticalScale } from '@utils/normalizedCss';

const NotificationHeader = () => {
    const { t } = useTranslation();

    return <>
        <InterventionHeader title={t('client.settings.notifications')} showHelp={false} />
        <Subtitle>{t('notifications.subtitle')}</Subtitle>
    </>;
};

export default NotificationHeader;

const Subtitle = styled(Text).attrs({ variant: 'regular', color: 'gray600' })`
  margin-top: ${verticalScale(4)}px;
  margin-bottom: ${verticalScale(18)}px;
`;

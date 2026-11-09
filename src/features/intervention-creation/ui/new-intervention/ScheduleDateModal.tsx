import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import { useTheme } from '@theme';
import type { ScheduleDateModalProps } from './types';

const DatePicker = require('react-native-date-picker').default;

const ScheduleDateModal: React.FC<ScheduleDateModalProps> = ({
    visible,
    selectedDate,
    onClose,
    onConfirm,
}) => {
    const { theme, themeMode } = useTheme();
    const { t, i18n } = useTranslation();
    const [draftDate, setDraftDate] = useState(selectedDate || new Date());

    useEffect(() => {
        if (visible) setDraftDate(selectedDate || new Date());
    }, [selectedDate, visible]);

    return (
        <DatePicker
            modal
            open={visible}
            mode="datetime"
            date={draftDate}
            minimumDate={new Date()}
            locale={i18n.language}
            title={t('intervention.creation.chooseDateAndTime')}
            confirmText={t('common.actions.confirm')}
            cancelText={t('common.actions.cancel')}
            theme={themeMode}
            buttonColor={theme.colors.primary}
            onConfirm={(date: Date) => {
                onConfirm(date);
                onClose();
            }}
            onCancel={onClose}
            onDateChange={setDraftDate}
            androidVariant={Platform.OS === 'android' ? 'nativeAndroid' : undefined}
        />
    );
};

export default ScheduleDateModal;

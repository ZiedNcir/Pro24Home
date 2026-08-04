import React, { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText, Button, radius, spacing, vSpacing } from '../../../../design-system';
import { ClientRoutes } from '../../../../navigation/routes';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';
import { ClientRequestLayout, RequestProgress } from '../components';
import {
  selectClientRequestDraft,
  setRequestDescription,
} from '../store/clientRequestDraft';

type Props = NativeStackScreenProps<any>;

export const C31ClientCreateRequestDescription: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector(selectClientRequestDraft);
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  const [title, setTitle] = useState(draft.title);
  const [description, setDescription] = useState(draft.description);

  const canContinue = title.trim().length >= 3 && description.trim().length >= 10;

  const next = () => {
    dispatch(setRequestDescription({ title: title.trim(), description: description.trim() }));
    navigation.navigate(ClientRoutes.CreateRequestPhotos as never);
  };

  return (
    <ClientRequestLayout
      navigation={navigation}
      title="Décrivez le problème"
      subtitle="Ajoutez les détails nécessaires pour aider le professionnel."
      step="Étape 2 sur 7"
      footer={
        <View style={{ gap: vSpacing[2] }}>
          <RequestProgress current={2} total={7} />
          <Button
            title="Continuer"
            rightIcon="arrowRight"
            disabled={!canContinue}
            onPress={next}
          />
        </View>
      }
    >
      <View style={styles.fieldGroup}>
        <AppText variant="bodyMedium" color={c.text}>Titre de la demande</AppText>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ex : Fuite sous l’évier"
          placeholderTextColor={c.textDisabled}
          style={styles.input}
        />
      </View>

      <View style={styles.fieldGroup}>
        <AppText variant="bodyMedium" color={c.text}>Description</AppText>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Expliquez le problème, l’urgence et les accès..."
          placeholderTextColor={c.textDisabled}
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.textarea]}
        />
      </View>
    </ClientRequestLayout>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  fieldGroup: {
    gap: vSpacing[2],
  },
  input: {
    minHeight: 56,
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.stroke,
    paddingHorizontal: spacing[4],
    color: c.text,
  },
  textarea: {
    minHeight: 150,
    paddingTop: spacing[4],
  },
});

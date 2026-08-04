import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText, Button, Icon, radius, shadows, spacing, vSpacing } from '../../../../design-system';
import { ClientRoutes } from '../../../../navigation/routes';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';
import { ClientRequestLayout, RequestProgress } from '../components';
import {
  addRequestPhoto,
  removeRequestPhoto,
  selectClientRequestDraft,
} from '../store/clientRequestDraft';

type Props = NativeStackScreenProps<any>;

export const C32ClientCreateRequestPhotos: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector(selectClientRequestDraft);
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  const addDemoPhoto = () => {
    dispatch(addRequestPhoto({
      uri: `local-photo-${Date.now()}`,
      name: `photo-${draft.photos.length + 1}.jpg`,
      type: 'image/jpeg',
    }));
  };

  return (
    <ClientRequestLayout
      navigation={navigation}
      title="Ajoutez des photos"
      subtitle="Optionnel, mais utile pour un devis plus précis."
      step="Étape 3 sur 7"
      footer={
        <View style={{ gap: vSpacing[2] }}>
          <RequestProgress current={3} total={7} />
          <Button
            title="Continuer"
            rightIcon="arrowRight"
            onPress={() => navigation.navigate(ClientRoutes.CreateRequestAddress as never)}
          />
        </View>
      }
    >
      <View style={styles.actionsRow}>
        <Pressable style={styles.photoAction} onPress={addDemoPhoto}>
          <Icon name="camera" size="lg" color={c.primary} />
          <AppText variant="bodyMedium" color={c.text} align="center">Caméra</AppText>
        </Pressable>

        <Pressable style={styles.photoAction} onPress={addDemoPhoto}>
          <Icon name="image" size="lg" color={c.primary} />
          <AppText variant="bodyMedium" color={c.text} align="center">Galerie</AppText>
        </Pressable>
      </View>

      <View style={styles.photosGrid}>
        {[0, 1, 2].map((index) => {
          const photo = draft.photos[index];

          return (
            <Pressable
              key={index}
              style={[styles.photoSlot, photo && styles.photoSlotFilled]}
              onPress={() => photo ? dispatch(removeRequestPhoto(index)) : addDemoPhoto()}
            >
              {photo ? (
                <>
                  <Icon name="check" size="md" color={c.textInverse} />
                  <AppText variant="caption" color={c.textInverse} align="center">
                    Photo {index + 1}
                  </AppText>
                </>
              ) : (
                <>
                  <Icon name="plus" size="md" color={c.primary} />
                  <AppText variant="caption" color={c.textMuted} align="center">
                    Ajouter
                  </AppText>
                </>
              )}
            </Pressable>
          );
        })}
      </View>
    </ClientRequestLayout>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  photoAction: {
    flex: 1,
    minHeight: 112,
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.stroke,
    alignItems: 'center',
    justifyContent: 'center',
    gap: vSpacing[2],
    ...shadows.sm,
  },
  photosGrid: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  photoSlot: {
    flex: 1,
    height: 110,
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.stroke,
    alignItems: 'center',
    justifyContent: 'center',
    gap: vSpacing[1],
  },
  photoSlotFilled: {
    backgroundColor: c.primary,
    borderColor: c.primary,
  },
});

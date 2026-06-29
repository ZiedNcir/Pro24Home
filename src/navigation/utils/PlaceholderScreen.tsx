import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { AppText, colors, sizes } from '../../design-system';

export const PlaceholderScreen = () => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <AppText variant="h2" align="center">
        Écran en construction
      </AppText>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: sizes.screen.horizontalPadding,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

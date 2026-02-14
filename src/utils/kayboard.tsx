import React from 'react';
import {useEffect, useState} from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

export default function useKeyboardOverlay() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const Overlay = ({children}: {children?: React.ReactNode}) =>
    isKeyboardVisible ? (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.overlay} pointerEvents="box-none">
          {children}
        </View>
      </TouchableWithoutFeedback>
    ) : null;

  return {
    isKeyboardVisible,
    Overlay,
  };
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(128,128,128,0.02)', // light gray with opacity
    zIndex: 999,
  },
});

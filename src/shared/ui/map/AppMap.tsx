import React, { forwardRef } from 'react';
import { Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, type MapViewProps } from 'react-native-maps';

export const AppMap = forwardRef<MapView, MapViewProps>((props, ref) => (
  <MapView
    {...props}
    ref={ref}
    provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : props.provider}
  />
));

AppMap.displayName = 'AppMap';

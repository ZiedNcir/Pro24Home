import { createNavigationContainerRef } from '@react-navigation/native';
import type { AppStackType } from '../../navigation/constant/core';

export const navigationRef = createNavigationContainerRef<AppStackType>();


import AsyncStorage from '@react-native-async-storage/async-storage';

export enum Language {
  FR = 'fr',
  EN = 'en',
}

export type IRole = 'client' | 'professional';

export const Regex = {
  email:
    /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password: /\d+/,
  word: /\w+/,
  number: /\d+/,
};

// @utils/constant.ts
export const Colors = {
  // Original colors
  black: '#383838',
  white: '#FFFFFF',
  positive: '#43D2A8',
  warning: '#FE9228',
  danger: '#FF313D',
  orange: '#F55F42',
  gray: 'rgb(217, 217, 217)',
  field: '#F7F7F7',
  green: '#7FD858',

  // Light variants (12% opacity)
  positiveLight: '#43D2A820',
  warningLight: '#FE922820',
  dangerLight: '#FF313D20',
  orangeLight: '#F55F4220',

  // Overlay and shadow
  overlay: '#38383880', // 50% opacity
  shadow: '#383838',

  // Text colors
  text: {
    primary: '#383838',
    secondary: 'rgb(217, 217, 217)',
  },

  // Background colors
  background: {
    paper: '#FFFFFF',
    default: '#F8FAFF',
  },
};

// Optional: Create helper function to add opacity
export const withOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Example usage: Colors.positiveLight = withOpacity(Colors.positive, 0.12);

export const darkModeStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#808080' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#808080' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#808080' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#808080' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#808080' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#808080' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

export const lightModeStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] }, // Light gray background
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] }, // Dark gray text
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] }, // White text stroke for clarity

  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#424242' }], // Darker locality labels
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }], // Slightly muted POI labels
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#dcedc8' }], // Softer green for parks
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#2e7d32' }], // Darker green text for parks
  },

  // Road styles
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }], // White roads
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#bdbdbd' }], // Light gray road borders
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#424242' }], // Darker road text
  },

  // Highway styles
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#fbc02d' }], // Bright yellow highways
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e6ac00' }], // Stronger yellow stroke
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#212121' }], // Black text for better readability
  },

  // Transit styles
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#e0e0e0' }], // Light gray transit areas
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#37474f' }], // Darker blue-gray for transit labels
  },

  // Water styles
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#bbdefb' }], // Light blue water
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#01579b' }], // Deep blue water text
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#bbdefb' }], // Match the water color
  },
];

const getToken = async (): Promise<string | undefined | null> => {
  const token = await AsyncStorage.getItem('access_token');
  return token;
};

/*export const token = (async () => {
  const tokenResult = await getToken();
  if (!tokenResult) {
    return;
  }
  return tokenResult;
})();*/
export const token = getToken();
export type AppColor = keyof typeof Colors | string;

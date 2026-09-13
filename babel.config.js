module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
          '@app': './src/app',
          '@core': './src/core',
          '@entities': './src/entities',
          '@features': './src/features',
          '@roles': './src/roles',
          '@shared': './src/shared',
          '@components': './src/components',
          '@assets': './src/assets',
          '@types': './src/types',
          '@store': './src/store',
          '@screens': './src/screens',
          '@services': './src/services',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@translations': './src/translations',
          '@navigations': './src/navigations',
          '@constants': './src/constants',
          '@theme': './src/theme',
          '@contexts': './src/contexts',
        },
      }
    ]
  ],
};

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
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
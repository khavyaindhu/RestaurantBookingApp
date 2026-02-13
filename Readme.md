rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm install expo --legacy-peer-deps
npx expo install react-dom react-native-web @expo/metro-runtime --legacy-peer-deps
npx expo start --web --port 8081
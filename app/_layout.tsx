import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import LoadingScreen from './loading';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
      setIsReady(true);
      await SplashScreen.hideAsync();
    }, 2000); // 2 sec loading
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
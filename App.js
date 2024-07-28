import { Appearance } from 'react-native';
import AppNavigation from './navigation/AppNavigation';
import { useFonts } from 'expo-font';
import { useState, useEffect } from "react"
import { StatusBar } from 'expo-status-bar';

export default function App() {
  //using usefonts to import user specified fonts and only return the homepage when all the fonts is loaded
  const [loaded] = useFonts({
    'DmSans': require('./assets/fonts/DMSans-Medium.ttf'),
    'DmSans-B': require('./assets/fonts/DMSans-Bold.ttf'),
  })

  //getting the device color scheme darkmode or lightmode
  const [apperance, setApperance] = useState(Appearance.getColorScheme());

  useEffect(() => {
    //adding event listner on chaning the color theme
    const subscription = Appearance.addChangeListener(({ colorScheme }) => { setApperance(colorScheme) })
    //cleanup function
    return () => {
      subscription.remove()
    }
  }, [])

  //changing the statusbar color based on  the apperance mode
  const statusBarColor = apperance === 'dark' ? 'dark' : apperance == 'light' ? 'dark' : 'auto'


  if (!loaded) return null; // Prevent rendering until fonts are loaded
  return (
    <>
      <AppNavigation />
      <StatusBar style={statusBarColor} />
    </>
  );
}

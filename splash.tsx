import React, { useEffect, useRef } from 'react';
import { View,Text, Image, StyleSheet, Animated, Easing,
} from 'react-native';
import { router } from 'expo-router';


export default function SplashScreen() {

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {

    // Fade the logo in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    // Wait for 3 seconds, then go to Home
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 3000);

    return () => clearTimeout(timer);

  }, []);

  return (
    <View style={styles.container}>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          },
        ]}
      >

        <Image
          source={require('@/assets/images/Home Images/splash_icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.appName}>
          My App
        </Text>

        <Text style={styles.subtitle}>
          Welcome to my application
        </Text>

        <Text style={styles.loading}>
          Loading...
        </Text>

      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    alignItems: 'center',
  },

  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },

  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  subtitle: {
    fontSize: 15,
    color: '#FFFFFF',
    marginTop: 8,
  },

  loading: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 40,
  },
});
const timer = setTimeout(() => {
  router.replace("/home");
}, 5000);
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import * as Animatable from 'react-native-animatable';

export default function Inicio() {

  const passar = useNavigation();
  // Passa as páginas com o useNavigation

  function passarPag() {
    // Vai para página de login quando puxada por um botão
    passar.navigate('Login');
  }

  return (
    <LinearGradient
      colors={['#6b1584', '#780b88', '#5c2044']}
      start={{ x: 0.6, y: 0.1 }}
      end={{ x: 0.6, y: 0.6 }}
      style={styles.container}>

      <View style={styles.containerLogo}>
        <Animatable.Image
          iterationCount='infinite'
          iterationDelay={2000}
          animation="tada"
          source={require('../../../assets/poup.png')}
          style={styles.logo}
          resizeMode='contain'
        />
      </View>

      <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Gerencie suas finanças a qualquer momento e em qualquer lugar!</Text>
        <Text style={styles.text}>Faça o login para começar</Text>

        <TouchableOpacity style={styles.button} onPress={passarPag}>
          <Text style={styles.buttonText}>Acessar</Text>

        </TouchableOpacity>

      </Animatable.View>

    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  containerLogo: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerForm: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 12,
  },
  text: {
    color: '#a1a1a1'
  },
  button: {
    position: 'absolute',
    backgroundColor: '#71137f',
    borderRadius: 50,
    paddingVertical: 8,
    width: '60%',
    alignSelf: 'center',
    bottom: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold'
  },
  logo: {
    width: '100%',
    marginLeft: 5,
    marginTop: 20
  },
})

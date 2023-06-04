import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, TextInput, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';



export default function Cadastro() {
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaValida, setSenhaValida] = useState(true);

    const passar = useNavigation();
    // Passa as páginas com o useNavigation
    
    async function handleCadastro() {
        // Cuida dos processos dos dados para o cadastro
        if (!user || !email || !senha) {
            Alert.alert('Cadastro', 'Preencha todos os campos!');
            return;
        }


        if (senha.length < 6) {
            setSenhaValida(false);
            return;
        }

        setSenhaValida(true);

        try {
            await AsyncStorage.setItem('user', user);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('senha', senha);
            Alert.alert(
                'Cadastro',
                'Cadastro realizado com sucesso!',
            );
            passar.goBack();
        } catch (e) {
            Alert.alert('Cadastro', 'Erro ao realizar o cadastro.');
        }
    }


    return (

        <LinearGradient
            colors={['purple', 'lightgray']}
            start={{ x: 0.6, y: 0.3 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}>
            <Animatable.Image
                source={require('../../../assets/poupapp.png')}
                style={styles.logo}
                resizeMode='contain'
            />
            <TextInput 
            placeholder="Seu nome de usuário..." 
            style={styles.input} 
            autoCapitalize='none'
            onChangeText={text => setUser(text)} />
            <TextInput 
            placeholder="Seu e-mail..." 
            style={styles.input}
            autoCapitalize='none'
            keyboardType='email-address'
            onChangeText={text => setEmail(text)} />
            <TextInput 
            secureTextEntry={true} 
            placeholder="Sua senha..." 
            style={[styles.input, !senhaValida && styles.inputInvalid]} 
            autoCapitalize='none'
            onChangeText={text => setSenha(text)} />

            {!senhaValida && <Text style={styles.erro}>A senha precisa ter ao menos 6 caracteres</Text>}

            <Button
                onPress={handleCadastro}
                title="Cadastrar"
                color="#FFDE59"
                titleStyle={{ color: "#000" }}
            />
        </LinearGradient>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#71137f',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        width: '80%',
    },
    logo: {
        width: '90%',
        position: 'absolute',
        top: 90,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold'
    },
    inputInvalid: {
        borderColor: 'red',
    },
    erro: {
        marginVertical: 10
    }
});
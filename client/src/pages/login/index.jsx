import { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
    const [user, setUser] = useState('');
    const [senha, setSenha] = useState('');
    const [autenticado, setAutenticado] = useState(false);
    const passar = useNavigation();

    function irCad() {
        // Vai para página de cadastro quando puxada por um botão
        passar.navigate('Cadastro');
    }

    function irHome() {
        // Vai para página principal do app quando puxada por um botão
        passar.navigate('Home');
    }

    async function verificarAutenticacao() {
        // Verifica se o dispositivo possui meios de autenticação e quais são eles
        const compativel = await LocalAuthentication.hasHardwareAsync();
        const tipos = await LocalAuthentication.supportedAuthenticationTypesAsync();
    }

    async function handleAuth() {
        // Se tiver biometria registrada, autentica o usuário, senão, pede para registrar a biometria
        const temBiometria = await LocalAuthentication.isEnrolledAsync();

        if (!temBiometria) {
            return Alert.alert('Login', 'Nenhuma biometria encontrada. Cadastre uma biometria e retorne ao nosso app!')
        }
        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Login com Biometria',
            fallbackLabel: 'Biometria não reconhecida'
        });

        if (auth.success) {
            setAutenticado(true);
            irHome();
        } else {
            Alert.alert('Login', 'Falha na autenticação');
        }
    };

    async function handleLogin() {
        // Analisa os dados vindos do cadastro para efetuar o login
        try {
            const userArmazenado = await AsyncStorage.getItem('user');
            const senhaArmazenada = await AsyncStorage.getItem('senha');
    
            if (user === userArmazenado && senha === senhaArmazenada) {
                handleAuth();
            } else {
                Alert.alert('Login', 'Usuário ou senha inválidos');
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    
    useEffect(() => {
        // Executa a verificação uma vez para pegar as informações
        verificarAutenticacao();
    }, []);

    return (
        <LinearGradient colors={['#6b1584', '#780b88', '#a16734']}
            start={{ x: 0.4, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            locations={[0, 0.4, 1]}
            style={styles.container}>
            <Animatable.Image
                animation="tada"
                source={require('../../../assets/poupapp.png')}
                style={styles.logo}
                resizeMode='contain'
            />
            <View style={styles.inputView}>
                <Ionicons name="ios-at" size={24} color="gray" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={setUser}
                    value={user}
                />
            </View>
            <View style={styles.inputView}>
                <Ionicons name="md-lock-open" size={24} color="gray" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"

                    onChangeText={setSenha}
                    value={senha}
                    secureTextEntry={true}
                />
            </View>

            <TouchableOpacity activeOpacity={0.75} onPress={handleLogin} style={styles.entrar}>
                <LinearGradient
                    start={{ x: 0.05, y: 0 }}
                    end={{ x: 0.9, y: 1 }}
                    colors={['#5851DB', '#C13584', '#E1306C', '#F77737']}
                    style={styles.entrar}
                >
                    <Text style={styles.entrarText}>
                        Entrar
                    </Text>
                </LinearGradient>

                <TouchableOpacity onPress={irCad}>
                    <Text style={styles.supText}>Ainda não possui uma conta?</Text>
                    <Text style={styles.cadText}>Fazer cadastro!</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 90,
    },
    input: {
        padding: 10,
        marginVertical: 5,
        width: '80%',
    },
    inputView: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 3,
        marginVertical: 5,
        width: '80%',
    },
    entrar: {
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 10,
        margin: 13,
    },
    entrarText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cadText: {
        marginVertical: 5,
        color: '#002',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    supText: {
        color: 'black',
        fontSize: 12,
    },
    logo: {
        width: '90%',
        position: 'absolute',
        top: 90,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 3,
        marginLeft: 3,
    },
});

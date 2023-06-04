import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';

export default function App() {
  return (
    // Esconde a barra de notificações dentro do app
    <NavigationContainer>
      <StatusBar style="auto" hidden />
      <Routes />
    </NavigationContainer>
  );
}
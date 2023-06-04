import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Inicio from '../pages/Inicio/index'
import Login from '../pages/login/index'
import Home from '../pages/home/index'
import Cadastro from '../pages/cadastro/index'

const Stack = createNativeStackNavigator();

export default function Routes() {
  // Aqui definimos as rotas das telas
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen
        name="Inicio"
        component={Inicio}
      />
      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
      /> 
      <Stack.Screen
        name="Home"
        component={Home}
      />
    </Stack.Navigator>

  )
}
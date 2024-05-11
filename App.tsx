import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { LoginScreen, WelcomeScreen, ProductScreen, ProveedorScreen } from './src/screens';
import { createStackNavigator } from '@react-navigation/stack';
import { UserContextProvider, useUser } from './src/context/user/UserContext';
import ProductDetailScreen from './src/screens/product/details/ProductDetailScreen';
import CalculadoraScreen from './src/screens/calculadora/CalculadoraScreen';

const Stack = createStackNavigator();

const LoggedUser = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Proveedor" component={ProveedorScreen} />
                <Stack.Screen name="Calculadora" component={CalculadoraScreen} />
                <Stack.Screen name="Product" component={ProductScreen} />
                <Stack.Screen name="ProductDetails" component={ProductDetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const UnloggedUser = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const Container = () => {
    const {user} = useUser();

    console.log(' >>>> USER IN APP.TSX >>>>> ', user);

    return user ? <LoggedUser /> : <UnloggedUser />
}

const App = () => {

    return (
        <UserContextProvider>
            <Container />
        </UserContextProvider>

    )
}

export default App;

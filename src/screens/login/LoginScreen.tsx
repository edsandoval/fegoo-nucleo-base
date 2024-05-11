import React, {useEffect, useState } from 'react'
import { SafeAreaView, View, ImageBackground, Image, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { StackScreenProps } from '@react-navigation/stack';
import { supabase } from '../../lib/initSupabase';
import Loading from '../../components/loading/Loading';
interface Props extends StackScreenProps<any, any> {}

enum AuthType {
    LOGIN = 'LOGIN',
    SIGNUP = 'SIGNUP',
}
const isLogin = (type: AuthType) => type === AuthType.LOGIN;
const isSignup = (type: AuthType) => type === AuthType.SIGNUP;

const LoginScreen = ({navigation}: Props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const defaultEmail = 'email@address.com';

    useEffect(() => {
        setEmail('sandoval.e.d@gmail.com');
        setPassword('27409469');
    }, []);

    const getMessage = (error: any) => {
        const message = error.message;
        switch (message) {
            case 'Invalid login credentials':
                return 'Credenciales de inicio de sesión no válidas';
            case 'Signup requires a valid password':
                return 'El registro requiere una contraseña válida';
            case 'Password should be at least 6 characters.':
                return 'La contraseña debe tener al menos 6 caracteres.';
            case 'To signup, please provide your email':
                return 'Para registrarse, proporcione su correo electrónico';
            default:
                return message;
        }
    }

    const handleLogin = async (type: AuthType, email: string, password: string) => {
        setLoading(true);

        const {error, data} = isLogin(type) ? await supabase.auth.signInWithPassword({email, password}) : await supabase.auth.signUp({email, password})

        console.log('DATA:::: ', data);
        console.log('ERROR:::: ', error);

        if (error) {
            Alert.alert(getMessage(error));
        } else {
            if (data.user && !data.session && isSignup(type)) {
                Alert.alert('Cheque su correo electrónico para verificar su cuenta!')
            }
        }

        setLoading(false);
    }

    const renderLogo = () => {
        return (
            <View
                style={{
                    alignItems: "center",
                    margin: 10,
                }}>
                <Image
                    source={require('../../../assets/images/login.png')}
                    resizeMode={"cover"}
                    style={{
                        width: 140,
                        height: 140,
                    }}
                />
            </View>
        )
    }

    const renderEmail = () => {
        return (
            <View
                style={{
                    marginVertical: 16,
                }}>
                <Text
                    style={{
                        color: "#7C7C7C",
                        fontSize: 16,
                        fontWeight: "bold",
                        marginBottom: 8,
                    }}>
                    {"Email"}
                </Text>
                <TextInput
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholder={defaultEmail}
                    autoCapitalize={"none"}
                    style={{
                        color: "#181725",
                        fontSize: 18,
                        marginVertical: 12,
                        height: 22,
                        backgroundColor: "#ffffff",
                    }}
                />
                <View
                    style={{
                        height: 1,
                        backgroundColor: "#E2E2E2",
                    }}>
                </View>
            </View>

        )
    }

    const renderPassword = () => {
        return (
            <View
                style={{
                    marginVertical: 16,
                }}>
                <Text
                    style={{
                        color: "#7C7C7C",
                        fontSize: 16,
                        fontWeight: "bold",
                        marginBottom: 8,
                    }}>
                    {"Password"}
                </Text>
                <TextInput
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    placeholder={"*************"}
                    secureTextEntry={true}
                    style={{
                        color: "#181725",
                        fontSize: 18,
                        marginTop: 12,
                        marginBottom: 8,
                        height: 22,
                        backgroundColor: "#ffffff",
                    }}
                />
                <View
                    style={{
                        height: 1,
                        backgroundColor: "#E2E2E2",
                    }}>
                </View>
            </View>

        )
    }

    const renderButtonLogin = () => {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <TouchableOpacity
                    onPress={() => handleLogin(AuthType.LOGIN, email, password)}
                    disabled={loading}
                    style={{
                        height: 50,
                        width: 190,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#53B175",
                        borderRadius: 20,
                        marginVertical: 10,
                    }}>
                    <Text
                        style={{
                            color: "#FFF9FF",
                            fontSize: 18,
                            fontWeight: "bold",
                        }}>
                        {"Iniciar sesión"}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderCanSignup = () => {
        return (
            <View
                style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Text
                    style={{
                        color: "#181725",
                        fontSize: 14,
                    }}>
                    {"¿No tienes una cuenta?"}
                </Text>
                <TouchableOpacity
                    onPress={() => handleLogin(AuthType.SIGNUP, email, password)}
                    disabled={loading}
                    style={{
                        height: 50,
                        width: 190,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#F2F1F1",
                        borderColor: "#000",
                        borderWidth: 1,
                        borderRadius: 20,
                        marginVertical: 10,
                    }}>
                    <Text
                        style={{
                            color: "#FF6C44",
                            fontSize: 18,
                            fontWeight: "bold",
                        }}>
                        {"Registrarse"}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
            }}>
            <ImageBackground
                source={{uri: 'https://raw.githubusercontent.com/coredxor/images/main/bk_login.png'}}
                resizeMode={'stretch'}
                style={{
                    flex: 1,
                    padding: 20,
                }}
            >
                {renderLogo()}
                <Text
                    style={{
                        color: "#181725",
                        fontSize: 26,
                        fontWeight: "bold",
                    }}>
                    {"Login"}
                </Text>
                <Text
                    style={{
                        color: "#7C7C7C",
                        fontSize: 16,
                        marginVertical: 15,
                    }}>
                    {"Ingrese sus datos para iniciar sesión"}
                </Text>
                {renderEmail()}
                {renderPassword()}

                {/*                <View*/}
                {/*style={{*/}
                {/*flexDirection: "row",*/}
                {/*alignItems: "center",*/}
                {/*}}>*/}
                {/*<View*/}
                {/*style={{*/}
                {/*flex: 1,*/}
                {/*alignSelf: "stretch",*/}
                {/*}}>*/}
                {/*</View>*/}
                {/*<TouchableOpacity>*/}
                {/*<Text*/}
                {/*style={{*/}
                {/*color: "#181725",*/}
                {/*fontSize: 14,*/}
                {/*}}>*/}
                {/*{"¿Has olvidado la contraseña?"}*/}
                {/*</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*</View>*/}


                {renderButtonLogin()}
                {renderCanSignup()}

                <Loading loading={loading} />
            </ImageBackground>
        </SafeAreaView>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
})


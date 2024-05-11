import React from "react";
import { SafeAreaView, View, ImageBackground, Image, Text } from "react-native";
import Constants from 'expo-constants';
import { StackScreenProps } from '@react-navigation/stack';
interface Props extends StackScreenProps<any, any> {}

const WelcomeScreen = ({navigation}: Props) => {
    const appVersion = Constants?.expoConfig?.version;

    const goToLogin = () => {
        navigation.navigate("Login");
    };

    const renderButton = () => {
        return (
            <View
                style={{
                    height: 65,
                    alignSelf: "stretch",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#53B175",
                    borderRadius: 20,
                    margin: 16,
                }}>
                <Text
                    onPress={goToLogin}
                    style={{
                        width: "100%",
                        textAlign: "center",
                        color: "#FFF9FF",
                        fontSize: 18,
                        fontWeight: "bold",
                    }}>
                    {"Iniciar"}
                </Text>
            </View>
        )
    }

    const renderAppVersion = () => {
        return (
            <Text
                style={{
                    color: "#FCFCFC",
                    fontSize: 10,
                    marginBottom: 20,
                }}>
                {appVersion}
            </Text>
        )
    }

    const renderBody = () => {
        return (
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <View style={{alignItems: 'center', marginTop: 80}}>
                    <Image
                        source={{uri: 'https://raw.githubusercontent.com/coredxor/images/main/crot.png'}}
                        resizeMode="stretch"
                        style={{width: 70, height: 70}}
                    />
                    <Text style={{color: '#ffffff', fontSize: 50, fontWeight: 'bold', marginBottom: 0}}>
                        Nucleo
                    </Text>
                    {renderAppVersion()}
                    <Text style={{color: '#FCFCFC', fontSize: 15, marginBottom: 12}}>
                        Banco de precios con actualizaciones automáticas
                    </Text>
                </View>
                {renderButton()}
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
                source={require("../../../assets/images/seis.jpg")}
                resizeMode={'stretch'}
                style={{
                    flex: 1,
                }}>
                {renderBody()}
            </ImageBackground>
        </SafeAreaView>
    )
}

export default WelcomeScreen;

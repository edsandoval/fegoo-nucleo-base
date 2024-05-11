import React, {useEffect, useState} from "react";
import {SafeAreaView, View, Text, Image, TouchableOpacity, FlatList, } from "react-native";
import {StackScreenProps} from '@react-navigation/stack';
import {supabase} from "../../lib/initSupabase";
import Loading from "../../components/loading/Loading";
import {Proveedor} from "../../model/proveedor";
interface Props extends StackScreenProps<any, any> {}

const ProveedorScreen = ({navigation}: Props) => {
    const [proveedores, setProveedores] = useState<Array<Proveedor>>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        fetchProveedores();
    }, [])

    const fetchProveedores = async () => {
        setLoading(true)
        const {data: proveedores, error} = await supabase
            .from('Proveedor')
            .select('*')
            .order('id', {ascending: false})
        if (error) {
            console.log('error', error)
        } else {
            console.log('Proveedores', proveedores);
            setProveedores(proveedores!)
        }
        setLoading(false)
    }

    const goToCalculadora = () => {
        navigation.navigate('Calculadora')
    }

    const renderTitle = () => {
        return (
            <View
                style={{
                    paddingTop: 40,
                    height: 100,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Text
                    style={{
                        color: "#181725",
                        fontSize: 20,
                        fontWeight: "bold",
                    }}>
                    {"Seleccionar Proveedor"}
                </Text>
            </View>
        )
    }

    const renderProveedor = ( {item}: any ) => {
        return (
            <TouchableOpacity
                onPress={() => onProveedorPress(item)}
                style={{
                    flex: 0.5,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: item.bgcolor,
                    borderColor: "#53B175",
                    borderRadius: 16,
                    borderWidth: 2,
                    marginRight: 4,
                    marginLeft: 4,
                    marginBottom: 12
                }}>
                <Image
                    source={item.imagen ? {uri: item.imagen} : require('../../../assets/images/proveedor1.png')}
                    resizeMode={"stretch"}
                    style={{
                        width: 110,
                        height: 75,
                        marginVertical: 25,
                    }}
                />
                <Text
                    style={{
                        color: "#181725",
                        fontSize: 16,
                        fontWeight: "bold",
                    }}>
                    {item.nombre}
                </Text>
            </TouchableOpacity>
        )
    }

    const onProveedorPress = (item: Proveedor) => {
        const params = {
            calledFrom: "Proveedor",
            proveedor: item
        }
        navigation.navigate("Product", params);
    }

    const renderBody = () => {
        return (

            <View style={{flex: 1, justifyContent: 'space-between'}}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#ffffff",
                }}>
                {
                    //TODO: Permitir buscar por proveedor
                    //renderSearch()
                }
                <FlatList
                    data={proveedores}
                    renderItem={renderProveedor}
                    keyExtractor={(item) => `${item.id}`}
                    numColumns={2}
                />
            </View>
            {renderButton()}
            </View>
        )
    }

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
                    onPress={goToCalculadora}
                    style={{
                        width: "100%",
                        textAlign: "center",
                        color: "#FFF9FF",
                        fontSize: 18,
                        fontWeight: "bold",
                    }}>
                    {"Calculadora"}
                </Text>
            </View>
        )
    }

    const renderTab = () => {
        return (
            <View
                style={{
                    height: 70,
                    flexDirection: "row",
                    borderColor: "#808080",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    borderWidth: 2,
                }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Image
                        source={{uri: "https://raw.githubusercontent.com/coredxor/images/main/i1.png"}}
                        resizeMode={"stretch"}
                        style={{
                            width: 25,
                            height: 25,
                            marginVertical: 8,
                        }}
                    />
                    <Text
                        style={{
                            color: "#181725",
                            fontSize: 14,
                        }}>
                        {"Shop"}
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Image
                        source={{uri: "https://raw.githubusercontent.com/coredxor/images/main/i7.png"}}
                        resizeMode={"stretch"}
                        style={{
                            width: 25,
                            height: 25,
                            marginVertical: 8,
                        }}
                    />
                    <Text
                        style={{
                            color: "#53B175",
                            fontSize: 14,
                            fontWeight: "bold",
                        }}>
                        {"Explore"}
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Image
                        source={{uri: "https://raw.githubusercontent.com/coredxor/images/main/i4.png"}}
                        resizeMode={"stretch"}
                        style={{
                            width: 25,
                            height: 25,
                            marginVertical: 8,
                        }}
                    />
                    <Text
                        style={{
                            color: "#181725",
                            fontSize: 14,
                        }}>
                        {"Cart"}
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Image
                        source={{uri: "https://raw.githubusercontent.com/coredxor/images/main/i5.png"}}
                        resizeMode={"stretch"}
                        style={{
                            width: 25,
                            height: 25,
                            marginVertical: 8,
                        }}
                    />
                    <Text
                        style={{
                            color: "#181725",
                            fontSize: 14,
                        }}>
                        {"Favourite"}
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Image
                        source={{uri: "https://raw.githubusercontent.com/coredxor/images/main/i2.png"}}
                        resizeMode={"stretch"}
                        style={{
                            width: 25,
                            height: 25,
                            marginVertical: 8,
                        }}
                    />
                    <Text
                        style={{
                            color: "#303233",
                            fontSize: 14,
                        }}>
                        {"Account"}
                    </Text>
                </View>
            </View>

        )
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
            }}>
            {renderTitle()}
            {renderBody()}
            <Loading loading={loading}/>
        </SafeAreaView>
    )
}

export default ProveedorScreen;

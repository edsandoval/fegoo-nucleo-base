import {useEffect, useState} from "react";
import {useIsFocused} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {FlatList, SafeAreaView, Text, Image, TouchableOpacity, View} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from "../../components/loading/Loading";
import KeyValueStorage from "../../util/KeyValueStorage";
import Counter from "../../components/counter/Counter";
import NumberUtil from "../../util/NumberUtil";
import {DEFAULT_VENTA_POR, Producto} from "../../model/producto";
interface Props extends StackScreenProps<any, any> {}

const CalculadoraScreen = ({navigation}: Props) => {
    const [total, setTotal] = useState<number>(0);
    const [cantidad, setCantidad] = useState<number>(0);
    const [productos, setProductos] = useState<Array<Producto>>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const isFocused = useIsFocused();

    useEffect(() => {
        setLoading(true);

        getProductosFromLocalStorage().then((lsProductos) => {
            setProductos(lsProductos);
            calculateTotal(lsProductos);
            setLoading(false);
        });
    }, [isFocused]);

    const onAddProductPress = () => {
        const params = {
            calledFrom: 'Calculadora',
        }

        navigation.navigate("Product", params);
    }

    const calculateTotal = (productos: Array<Producto> = []) => {
        let total = 0;
        let cantidad = 0;
        productos.forEach((producto) => {
            if(producto.venta_por === DEFAULT_VENTA_POR) {
                total += producto.precio_final * producto.cantidad;
                cantidad += producto.cantidad;
            } else {
                cantidad += 1;
                total += (producto.precio_final * producto.venta_por_unidad)/producto.unidad_referencia
            }
        });
        setTotal(NumberUtil.fixed2(total));
        setCantidad(cantidad);
    }

    const getProductosFromLocalStorage = async () => {
        const strProductos = await KeyValueStorage.get('productos');
        return JSON.parse(strProductos ?? '[]');
    }

    const clearLocalStorage = () => {
        AsyncStorage.clear();
    }

    const renderTitle = () => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 40,
                    padding: 16,
                    backgroundColor: "#FFFFFF",
                    borderBottomWidth: 1,
                    borderBottomColor: "#E2E2E2",
                }}>
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#000000",
                    }}>
                    Calculadora de precios
                </Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: "red",
                        borderRadius: 14,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderWidth: 1,
                    }}
                    onPress={() => {
                        clearLocalStorage();
                        setProductos([]);
                        setTotal(0);
                        setCantidad(0);
                    }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#FFFFFF",
                        }}>
                        Limpiar
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const calcularPrecioProducto = (item: Producto) => {
        if (item.venta_por === DEFAULT_VENTA_POR) {
            return NumberUtil.fixed2(item.precio_final * item.cantidad);
        } else {
            return NumberUtil.fixed2((item.venta_por_unidad * item.precio_final)/item.unidad_referencia)
        }
    }

    const showCantidadProductos = () => {
        return "Tienes " + cantidad + " productos en tu lista"
    };

    const renderBody = () => {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#FFFFFF",
                }}>
                <View
                    style={{
                        backgroundColor: "#dcdcdc",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 4,
                        borderWidth: 1,
                    }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#000000",
                        }}>
                        {productos.length > 0
                            ? showCantidadProductos()
                            : "No hay productos para sumar"}
                    </Text>
                </View>
                <View
                    style={{
                        flex: 5,
                        backgroundColor: "#FFFFFF",
                    }}>
                    <FlatList
                        data={productos}
                        renderItem={renderProducto}
                        keyExtractor={(item: Producto) => item.id.toString()}
                    />
                </View>
                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        paddingRight: 10,
                        borderWidth: 1,
                    }}>
                    <Text style={{fontSize: 24, fontWeight: "bold"}}>Total</Text>
                    <Text style={{fontSize: 24, fontWeight: "bold", color: "green"}}>$ {total}</Text>
                </View>
                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: 10,
                    }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "green",
                            padding: 10,
                            borderRadius: 14,
                        }}
                        onPress={onAddProductPress}>
                        <Text
                            style={{
                                fontSize: 16,
                                paddingHorizontal: 20,
                                fontWeight: "bold",
                                color: "#FFFFFF",
                            }}>
                            Agregar Producto
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderProducto = ({item}: any) => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignSelf: 'stretch',
                    justifyContent: 'space-between',
                    borderColor: '#E2E2E2',
                    borderRadius: 16,
                    borderWidth: 1,
                    padding: 12,
                    marginRight: 4,
                    marginLeft: 4,
                    marginBottom: 8,
                }}>
                <View style={{width: '30%', alignItems: 'flex-start'}}>
                    <Image
                        source={item.imagen ? {uri: item.imagen} : require('../../../assets/images/not_found.png')}
                        resizeMode={'cover'}
                        style={{
                            width: 100,
                            height: 100,
                        }}
                    />
                </View>
                <View style={{width: '70%', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10}}>
                    <Text
                        style={{
                            color: '#181725',
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginBottom: 8,
                        }}>
                        {item.nombre}
                    </Text>
                    <Text
                        style={{
                            color: '#7C7C7C',
                            fontSize: 14,
                        }}>
                        {'$ ' + item.precio_lista}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "100%"}}>
                        <Text
                            style={{
                                color: 'green',
                                fontSize: 22,
                                fontWeight: 'bold',
                                alignSelf: 'flex-start',
                            }}>
                            {'$ ' +  calcularPrecioProducto(item)}
                        </Text>
                        <Counter
                            onChange={(value: any) => {
                                let fProductos = productos;
                                if (value === 0) {
                                    fProductos = productos.filter((p: any) => p.id !== item.id);
                                } else {
                                    item.cantidad = value;
                                }
                                setProductos(fProductos);
                                calculateTotal(fProductos);
                                KeyValueStorage.set('productos', JSON.stringify(fProductos));
                            }}
                            count={item.cantidad}
                            venta={item.venta_por_unidad}
                            unidad={item.venta_por}
                        />
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
            }}>
            {renderTitle()}
            {renderBody()}
            <Loading loading={loading} />
        </SafeAreaView>
    );
}

export default CalculadoraScreen;


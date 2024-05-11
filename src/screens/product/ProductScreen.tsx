import React, {useEffect, useState} from "react";
import {useIsFocused} from '@react-navigation/native';
import {SafeAreaView, View, TouchableOpacity, Image, Text, FlatList, } from "react-native";
import {StackScreenProps} from '@react-navigation/stack';
import {supabase} from "../../lib/initSupabase";
import Icon from 'react-native-vector-icons/FontAwesome'
import Loading from "../../components/loading/Loading";
import UpdateIndicator from "../../components/update-indicator/UpdateIndicator";
import {TextInput} from "react-native";
import KeyValueStorage from "../../util/KeyValueStorage";
import {DEFAULT_UNIDAD_REFERENCIA, DEFAULT_VENTA_POR, Producto} from "../../model/producto";
import BasicModal from "../../components/basic-modal/BasicModal";
interface Props extends StackScreenProps<any, any> {}

const ProductScreen = ({navigation, route}: Props) => {
    const [productos, setProductos] = useState<Array<Producto>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [calledFrom, setCalledFrom] = useState<string>('Proveedor');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [tmpProducto, setTmpProducto] = useState<Producto>({} as Producto);
    const isFocused = useIsFocused();

    useEffect(() => {
        fetchProductos();
    }, [isFocused, search])

    const showErrorAndSetProduct = (error: any, productos: any) => {
        if (error) {
            console.log('error', error)
        } else {
            console.log('Productos', productos);
            setProductos(productos!)
        }
    }

    const fetchProductos = async () => {
        setLoading(true)
        const {calledFrom, proveedor } = route?.params ?? {};
        setCalledFrom(calledFrom);

        console.log('calledFrom>>>>>>>>>', calledFrom)
        console.log('search>>>>>>>>>>', search)

        if (calledFrom === 'Proveedor') {
            const proveedor_id = proveedor.id;
            const {data: productos, error} = await supabase
                .from('Producto')
                .select('*')
                .eq('proveedor_id', proveedor_id)
                .ilike('nombre', `%${search}%`)
                .order('nombre', {ascending: true});

            showErrorAndSetProduct(error, productos);
        } else if (calledFrom === 'Calculadora') {
            const {data: productos, error} = await supabase
                .from('Producto')
                .select('*')
                .ilike('nombre', `%${search}%`)
                .order('nombre', {ascending: true})
                .limit(25)

            showErrorAndSetProduct(error, productos);
        }

        setLoading(false)
    }

    const goToBack = () => {
        navigation.goBack();
    };

    const onProductPress = (item: Producto) => {
        if (calledFrom !== 'Calculadora') {
            navigation.navigate("ProductDetails", {producto: item});
        }
    }

    const onProductNewPress = () => {
        const proveedorId = route?.params?.proveedor?.id ?? 0;
        const nuevoProducto: Producto = {
            id: 0,
            nombre: '',
            precio_lista: 0,
            precio_final: 0,
            porcentaje: 0,
            categoria_id: 1,
            venta_por: DEFAULT_VENTA_POR,
            unidad_referencia: Number(DEFAULT_UNIDAD_REFERENCIA),
            proveedor_id: proveedorId,
            imagen: '',
            fecha_creacion: new Date().toISOString(),
            fecha_actualizacion: new Date().toISOString(),
            cantidad: 0,
            venta_por_unidad: 0
        }
        navigation.navigate("ProductDetails", {producto: nuevoProducto});
    }

    const renderTitle = () => {
        return (
            <View
                style={{
                    height: 80,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 40,
                    paddingHorizontal: 16,
                }}>
                <TouchableOpacity
                    onPress={goToBack}
                    style={{
                        padding: 12,
                    }}>
                    <Image
                        source={{uri: "https://raw.githubusercontent.com/coredxor/images/main/a1.png"}}
                        resizeMode={"stretch"}
                        style={{
                            width: 12,
                            height: 20,
                        }}
                    />
                </TouchableOpacity>
                <Text
                    style={{
                        color: "#181725",
                        fontSize: 20,
                        fontWeight: "bold",
                    }}>
                    {" Productos "}
                </Text>
                { calledFrom !== "Calculadora" && ( 
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#2196F3',
                            borderRadius: 14,
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            borderWidth: 1,
                        }}
                        onPress={onProductNewPress}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "#FFFFFF",
                            }}>
                            Nuevo
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        )
    }

    const renderSearch = () => {
        return (
            <View
                style={{
                    height: 50,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#F2F3F2",
                    borderRadius: 16,
                    paddingHorizontal: 12,
                    margin: 16,
                }}>
                <Image
                    source={{uri: "https://raw.githubusercontent.com/coredxor/images/main/v6.png"}}
                    resizeMode={"stretch"}
                    style={{
                        width: 20,
                        height: 20,
                        marginRight: 8,
                    }}
                />
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder={"Buscar productos..."}
                    style={{
                        color: "green",
                        fontSize: 20,
                        flex: 1,
                        alignSelf: "stretch",
                        padding: 12,
                    }}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Image
                            source={require("../../../assets/images/clear.png")}
                            resizeMode={"stretch"}
                            style={{
                                width: 25,
                                height: 25,
                                marginLeft: 8,
                            }}
                        />
                    </TouchableOpacity>
                )}
            </View>
        )
    }

    const agregarProductoACalculadora = (item: Producto) => {
        if(item.venta_por !== DEFAULT_VENTA_POR && !item.venta_por_unidad) {
            setTmpProducto(item);
            setModalVisible(true);
            return;
        }
        console.log('Agregar producto a calculadora >>>>>>>>>>>>> ', item);
        KeyValueStorage.get('productos')
            .then((productos) => {
                console.log('Productos: ', productos);
                if (productos) {
                    const productosArray = JSON.parse(productos);
                    const producto = productosArray.find((p: any) => p.id === item.id);
                    if (producto) {
                        console.log('Producto encontrado: ', producto);
                        producto.cantidad = producto.cantidad + 1;
                        producto.venta_por_unidad = item.venta_por_unidad;
                        KeyValueStorage.set('productos', JSON.stringify(productosArray))
                    } else {
                        console.log('Producto no encontrado');
                        item.cantidad = 1;
                        productosArray.push(item);
                        KeyValueStorage.set('productos', JSON.stringify(productosArray))
                    }
                } else {
                    console.log('No hay productos');
                    item.cantidad = 1;
                    const productosArray = [];
                    productosArray.push(item);
                    KeyValueStorage.set('productos', JSON.stringify(productosArray))
                }
                goToBack();
        });
    }

    const renderProducto = ({item}: any) => {
        return (
            <TouchableOpacity
                onPress={() => onProductPress(item)}
                style={{
                    flex: 0.5,
                    alignSelf: "stretch",
                    justifyContent: "space-between",
                    borderColor: "#E2E2E2",
                    borderRadius: 16,
                    borderWidth: 1,
                    padding: 12,
                    marginRight: 4,
                    marginLeft: 4,
                    marginBottom: 8,
                    position: 'relative'
                }}
            >
                {calledFrom === 'Calculadora' && (
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            right: 5,
                            top: 5,
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: '#2196F3',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 100
                        }}
                        onPress={() => agregarProductoACalculadora(item)}>
                        <Icon name="plus" size={30} color="white" />
                    </TouchableOpacity>
                )}

                <View
                    style={{
                        alignItems: "center",
                    }}
                >
                    <Image
                        source={item.imagen ? {uri: item.imagen} : require('../../../assets/images/not_found.png')}
                        resizeMode={"cover"}
                        style={{
                            width: 100,
                            height: 100,
                        }}
                    />
                </View>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                    }}>
                    <Text
                        style={{
                            color: "#181725",
                            fontSize: 16,
                            fontWeight: "bold",
                            marginBottom: 8,
                        }}>
                        {item.nombre}
                    </Text>
                    <Text
                        style={{
                            color: "#7C7C7C",
                            fontSize: 14,
                        }}>
                        {"$ " + item.precio_lista}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                    <Text
                        style={{
                            color: "green",
                            fontSize: 22,
                            fontWeight: "bold",
                        }}>
                        {"$ " + item.precio_final}
                    </Text>
                    <View
                        style={{
                            flex: 1,
                            alignSelf: "stretch",
                        }}>
                    </View>
                    { item.encadenado ? 
                        <View style={{flexDirection: "row", alignItems: "center", paddingHorizontal: 4, marginTop: 4}}>
                            <Icon name="chain" size={20} color="#7C7C7C" />
                        </View>
                        : null 
                    }
                    <UpdateIndicator item={item} />
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: "bold",
                        }}>
                        {""}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyResult = ({onPress}: any) => {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name="exclamation-triangle" size={50} color="orange" />
                <Text style={{fontSize: 20, marginTop: 10}}>No hay productos disponibles</Text>
                <TouchableOpacity
                    onPress={onPress}
                    style={{
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#53B175",
                        borderRadius: 20,
                        marginVertical: 20,
                        paddingHorizontal: 20,
                    }}>
                    <Text
                        style={{
                            color: "#FFF9FF",
                            fontSize: 18,
                            fontWeight: "bold",
                        }}>
                        {"Volver al listado de proveedores"}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderPesableModal = () => {
        return (
            <BasicModal
                visible={modalVisible}
                text={`¿Cuántos (${tmpProducto.venta_por}) desea agregar?`}
                onClose={() => {
                    setModalVisible(false)
                }}
                onConfirm={(value: number) => {
                    if(value) {
                        tmpProducto.venta_por_unidad = value;
                    }
                    agregarProductoACalculadora(tmpProducto);
                    setModalVisible(false);
                }}
            />
        );
    };

    const renderBody = () => {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#ffffff",
                    marginVertical: 12,
                }}>
                <FlatList
                    data={productos}
                    renderItem={renderProducto}
                    keyExtractor={(item) => `${item.id}`}
                    numColumns={2}
                />
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
            {renderSearch()}
            {productos.length === 0 ? renderEmptyResult({onPress: () => navigation.goBack()}) : renderBody()}
            {renderPesableModal()}
            <Loading loading={loading} />
        </SafeAreaView>
    )
}

export default ProductScreen;

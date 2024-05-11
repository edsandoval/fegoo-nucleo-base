import React, {useEffect, useState} from 'react';
import {View, Image, TextInput, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView, FlatList} from 'react-native';
import {supabase} from '../../../lib/initSupabase';
import Loading from '../../../components/loading/Loading';
import {StackScreenProps} from '@react-navigation/stack';
import Slider from '@react-native-community/slider';
import NumberUtil from '../../../util/NumberUtil';
import {Picker} from '@react-native-picker/picker';
import {Categoria, DEFAULT_CATEGORIA} from '../../../model/categoria';
import {DEFAULT_UNIDAD_REFERENCIA, DEFAULT_VENTA_POR} from '../../../model/producto';
import Icon from 'react-native-vector-icons/FontAwesome'
import {ProductoEncadenado} from '../../../model/producto-encadenado';
import {CheckBox} from 'react-native-elements';
interface Props extends StackScreenProps<any, any> {}

const ProductDetailScreen = ({navigation, route}: Props) => {
    const [id, setId] = useState<number>(0);
    const [imagen, setImagen] = useState<string>("");
    const [nombre, setNombre] = useState<string>("");
    const [precioLista, setPrecioLista] = useState<string>('0');
    const [precioFinal, setPrecioFinal] = useState<number>(0);
    const [encadenado, setEncadenado] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const [mode, setMode] = useState<string>("");
    const [porcentaje, setPorcentaje] = useState<number>(0);
    const [proveedorId, setProveedorId] = useState<number>(0);
    const [fechaActualizacion, setFechaActualizacion] = useState<Date>(new Date());
    const [categorias, setCategorias] = useState<Array<Categoria>>([]);
    const [productosAsociados, setProductosAsociados] = useState<Array<any>>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria>(DEFAULT_CATEGORIA);
    const [ventaPorSeleccionada, setVentaPorSeleccionada] = useState<string>(DEFAULT_VENTA_POR);
    const [unidadReferencia, setUnidadReferencia] = useState<string>(DEFAULT_UNIDAD_REFERENCIA);
    const [precioEncadenadoSeleccionado, setPrecioEncadenadoSeleccionado] = useState<number>(0);

    const unidades = ["Unidad", "Kilogramos", "Litros", "Gramos", "Mililitros"];

    useEffect(() => {
        if (mode === "") {
            fetchProduct();
            fetchCategories();
        }
        calcularPrecioFinal()
    }, [precioLista]);

    const fetchProduct = async () => {
        setLoading(true);

        const producto = route?.params?.producto;
        setId(producto.id ?? 0);
        setMode(producto.id === 0 ? "create" : "edit");
        setImagen(producto.imagen ?? "")
        setNombre(producto.nombre ?? "");
        setPrecioLista(producto.precio_lista ?? 0);
        setPrecioFinal(producto.precio_final ?? 0);
        setEncadenado(producto.encadenado ?? false);
        setPorcentaje(producto.porcentaje ?? 0);
        setProveedorId(producto.proveedor_id ?? 0);
        setVentaPorSeleccionada(producto.venta_por ?? DEFAULT_VENTA_POR);
        setUnidadReferencia(String(producto.unidad_referencia ?? DEFAULT_UNIDAD_REFERENCIA));
        setFechaActualizacion(producto.fecha_actualizacion ?? new Date());

        if(producto.encadenado) {
            fetchProductosEncadenados(producto.id);
        }

        setLoading(false);
    };

    const fetchCategories = async () => {
        supabase
            .from("Categoria")
            .select("*")
            .then(({ data: categorias, error }) => {
                if (error) {
                    console.log(error);
                    return;
                }
                setCategorias(categorias);
                let catSeleccionada = categorias[0];
                const producto = route?.params?.producto;
                if(producto.categoria_id) {
                    catSeleccionada = categorias.find(c => c.id === producto.categoria_id);
                }
                setCategoriaSeleccionada(catSeleccionada);
            });
    }

    const fetchProductosEncadenados  = async (id: number) => {
        console.log('ID:::::', id);
        supabase
            .from("ProductoEncadenado")
            .select("*")
            .or(`eslabon1.eq.${id}, eslabon2.eq.${id}, eslabon3.eq.${id}, eslabon4.eq.${id}, eslabon5.eq.${id}`)
            .then(({ data: productosEncadenados, error }) => {
                if (error) {
                    console.log(error);
                    return;
                }

                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> PRODUCTOS ENCADENADOS: ", productosEncadenados);
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");
                setPrecioEncadenadoSeleccionado(id);
                fetchProductosAsociados(id, productosEncadenados);
            });
    }

    const fetchProductosAsociados = async (id: number, productosEncadenados: any) => {
        const idsEncadenados = []
        for (let i = 0; i < productosEncadenados.length; i++) {
            const productoEncadenado = productosEncadenados[i];
            if(productoEncadenado.eslabon1 != null) {
                idsEncadenados.push(productoEncadenado.eslabon1);
            }
            if(productoEncadenado.eslabon2 != null) {
                idsEncadenados.push(productoEncadenado.eslabon2);
            }
            if(productoEncadenado.eslabon3 != null) {
                idsEncadenados.push(productoEncadenado.eslabon3);
            }
            if(productoEncadenado.eslabon4 != null) {
                idsEncadenados.push(productoEncadenado.eslabon4);
            }
            if(productoEncadenado.eslabon5 != null) {
                idsEncadenados.push(productoEncadenado.eslabon5);
            }
        }

        console.log("idsEncadenados", idsEncadenados);

        supabase
            .from("Producto") 
            .select("id, precio_lista, Proveedor:proveedor_id (nombre)")
            .in("id", idsEncadenados)
            .then(({ data: productosAsociados, error }) => {
                if (error) {
                    console.error("Error fetching productos encadenados", error);
                    return;
                }
                console.log("Productos asociados:", productosAsociados);
                setProductosAsociados(productosAsociados);
            });
    }

    const grabarProducto = () => {
        console.log("Precio de lista actualizado:", precioLista);
        console.log("Precio final actualizado:", precioFinal);
        if (mode === "create") {
            createProduct();
        } else {
            updateProduct();
        }
    };

    const createProduct = async () => {
        supabase
            .from('Producto')
            .insert([{
                nombre: nombre,
                imagen: null,
                precio_lista: precioLista,
                precio_final: precioFinal,
                porcentaje: porcentaje,
                proveedor_id: proveedorId,
                categoria_id: categoriaSeleccionada.id,
                venta_por: ventaPorSeleccionada,
                unidad_referencia: unidadReferencia
            }])
            .then(() => {
                Alert.alert("Producto creado", "El producto se creó correctamente", [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack()
                    },
                ]);
            })
    };

    const updateProduct = async () => {
        // Creamos la fecha de actualizacion para usar en los updates.
        const now = new Date();

        // Creamos una lista que va a contener todas las promesas de supabase al grabar.
        const updates: any = [];

        // El precio de lista real, es el precio que realmente le corresponde al producto
        // sin importar que precio encadenado se halla usado para calcular el precio final.
        let precioListaReal = precioLista;
        if(productosAsociados.length > 0) {
            productosAsociados.forEach((p) => {
                if(id === p.id) {
                    precioListaReal = p.precio_lista;
                } else {
                    // Actualizamos los productos asociados distintos al principal.
                    updates.push(
                        supabase.from('Producto').update({
                            precio_lista: p.precio_lista,
                            porcentaje: porcentaje,
                            precio_final: precioFinal,
                            fecha_actualizacion: now
                        }).eq('id', p.id)
                    );
                }
            });

            // Espera a que todas las actualizaciones se completen
            await Promise.all(updates);
        }


        // Actualizamos el producto principal.
        supabase
            .from('Producto')
            .update({
                nombre: nombre,
                precio_lista: precioListaReal,
                precio_final: precioFinal,
                porcentaje: porcentaje,
                categoria_id: categoriaSeleccionada.id,
                venta_por: ventaPorSeleccionada,
                unidad_referencia: unidadReferencia,
                fecha_actualizacion: now})
            .eq('id', route?.params?.producto.id)
            .then((response) => {
                console.log("Producto actualizado:", response);
                navigation.goBack();
            })
    }

    const goToBack = () => {
        navigation.goBack();
    };

    const handlePorcentajeChange = (value: number) => {
        setPorcentaje(value);
        calcularPrecioFinal();
    };

    const handlerPrecioListaChange = (value: string) => {
        setPrecioLista(value);
    };

    const handlerPrecioListaEncadenado = (value: string, producto: any) => {
        console.log('Precio lista:', value);
        const newLst: Array<any> = [];
        productosAsociados.forEach((p) => {
            if (p.id === producto.id) {
                p.precio_lista = value;
            }

            if(p.id === precioEncadenadoSeleccionado) {
                setPrecioLista(p.precio_lista);
            }

            newLst.push(p);
        });
        setProductosAsociados(newLst);
    }

    const usarPrecioEncadenado = (producto: any) => {
        console.log('Usar precio encadenado:', producto);
        setPrecioEncadenadoSeleccionado(producto.id)
        setPrecioLista(producto.precio_lista);
    }

    const calcularPrecioFinal = () => {
        setPrecioFinal(NumberUtil.applyPercent(precioLista, porcentaje));
    };

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const hour = d.getHours().toString().padStart(2, '0');
        const minute = d.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hour}:${minute}`;
    };

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
                <TouchableOpacity onPress={goToBack} style={{
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
                    {mode === "edit" ? "Editar" : "Nuevo"} Producto
                </Text>

                { mode === "edit" && (
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'red',
                            borderRadius: 14,
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            borderWidth: 1,
                        }}
                        onPress={onProductDeletePress}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "#FFFFFF",
                            }}>
                            Borrar
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        )
    }

    const deleteProduct = async (id: number) => {
        console.log('Eliminado por ID: ', id);
        supabase
            .from("Producto")
            .delete()
            .eq("id", id)
            .then(() => {
                Alert.alert("Producto borrado", "El producto ha sido borrado correctamente");
                navigation.goBack();
            })
    }

    const onProductDeletePress = () => {
        Alert.alert(
            "Borrar Producto",
            "¿Estás seguro que deseas borrar este producto?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Borrar",
                    onPress: () => {
                        deleteProduct(id)
                        navigation.goBack()
                    }
                }
            ]
        )
    }

    const renderBody = () => {
        return (
            <View style={styles.container}>
                <View style={{
                    borderWidth: 2,
                    borderColor: "#E2E2E2",
                    alignItems: "center",
                    borderRadius: 8,
                    marginLeft: 16,
                    marginRight: 16,
                    marginTop: 4,
                    padding: 8
                }}>
                    <Image
                        source={imagen ? {uri: imagen} : require('../../../../assets/images/not_found.png')}
                        style={styles.imagenProducto}
                        resizeMode="cover"
                    />
                    <Text style={styles.nombreProducto}>{nombre}</Text>
                </View>
                <View style={styles.detalleContainer}>
                    <View style={styles.precioContainer}>
                        <Text style={styles.label}>{"Nombre:"}</Text>
                        <TextInput
                            style={styles.inputNombre}
                            value={nombre}
                            onChangeText={setNombre}
                            keyboardType="default"
                        />
                    </View>
                    <View style={styles.separator} />

                    <View style={styles.precioContainer}>
                        <Text style={styles.label}>{"Producto se vende por:"}</Text>
                        <Picker
                            selectedValue={ventaPorSeleccionada}
                            onValueChange={(itemValue) => setVentaPorSeleccionada(itemValue)}
                            style={{ height: 50, width: '100%', backgroundColor: '#f2f2f2', borderRadius: 8 }}>
                            {unidades.map((unidad, index) => (
                                <Picker.Item key={index} label={unidad} value={unidad} />
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.precioContainer}>
                        <Text style={styles.label}>{"Unidad Referencia:"}</Text>
                        <TextInput
                            style={styles.input}
                            value={unidadReferencia}
                            onChangeText={setUnidadReferencia}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.precioContainer}>
                        <Text style={styles.label}>{"Categoria:"}</Text>
                        <Picker
                            selectedValue={categoriaSeleccionada}
                            onValueChange={(itemValue) => setCategoriaSeleccionada(itemValue)}
                            style={{ height: 50, width: '100%', backgroundColor: '#f2f2f2', borderRadius: 8 }}>
                            {categorias.map((categoria, index) => (
                                <Picker.Item key={index} label={categoria.nombre} value={categoria} />
                            ))}
                        </Picker>
                    </View>

                    {
                        productosAsociados.length > 0 ? (
                            <View>
                                {productosAsociados.map((producto, index) => (
                                    <View key={index} style={styles.precioContainer}>
                                        <View style={{flexDirection: "row", alignItems: "center" }}>
                                            <Text style={styles.label}>{"Precio de Lista"}</Text>
                                            <Text style={styles.label}>({producto.Proveedor.nombre})</Text>
                                            <Icon name="chain" size={20} color="#7C7C7C" style={{marginLeft: 5}} />
                                        </View>

                                        <View style={{flexDirection: "row", alignItems: "center" }}>
                                        <TextInput
                                            style={styles.input}
                                            value={String(producto.precio_lista)}
                                            onChangeText={(v) => handlerPrecioListaEncadenado(v, producto)}
                                            keyboardType="decimal-pad"
                                        />
                                        <CheckBox
                                            title="Usar"
                                            checked={precioEncadenadoSeleccionado === producto.id}
                                            onPress={() => usarPrecioEncadenado(producto)}
                                        />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : (
                             <View style={styles.precioContainer}>
                                <Text style={styles.label}>{"Precio de Lista"}</Text>
                                <TextInput
                                    style={styles.input}
                                    value={String(precioLista)}
                                    onChangeText={handlerPrecioListaChange}
                                    keyboardType="decimal-pad"
                                />
                            </View>
                        )
                    }

                    <View style={styles.separator} />

                    <View style={styles.precioContainer}>
                        <Text style={styles.label}>Porcentaje: {porcentaje}%</Text>

                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={porcentaje}
                            minimumTrackTintColor="green"
                            thumbTintColor="green"
                            onValueChange={handlePorcentajeChange}
                        />

                    </View>

                    <View style={styles.precioContainer}>
                        <Text style={styles.label}>{"Precio de Venta"}</Text>
                        <Text style={styles.precioVenta}>{"$ " + precioFinal}</Text>
                    </View>

                    <View style={styles.fechaActualizacion}>
                        <Text style={styles.label}>{"Fecha de Actualización"}</Text>
                        <Text style={styles.fecha}>{formatDate(fechaActualizacion)}</Text>
                    </View>
                </View>

                <View style={styles.botonesContainer}>
                    <TouchableOpacity style={styles.boton} onPress={goToBack}>
                        <Text style={styles.textoBoton}>{"Volver"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boton} onPress={grabarProducto}>
                        <Text style={styles.textoBoton}>{"Grabar"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeAreaView}>
            {renderTitle()}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {renderBody()}
            </ScrollView>
            <Loading loading={loading} />
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    container: {
        flex: 1,
    },
    imagenProducto: {
        width: 150,
        height: 150,
    },
    slider: {
        height: 18,
        color: "green",
    },
    detalleContainer: {
        padding: 16,
    },
    nombreProducto: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    precioContainer: {
        marginBottom: 16,
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        width: "50%",
        borderRadius: 8,
        paddingHorizontal: 8,
        fontSize: 20,
        borderColor: "green",
        borderWidth: 4
    },
    inputNombre: {
        height: 40,
        width: "100%",
        borderRadius: 8,
        paddingHorizontal: 8,
        fontSize: 20,
        borderColor: "green",
        borderWidth: 4
    },
    fecha: {
        fontSize: 16,
        marginBottom: 8,
        color: "gray",
    },
    precioVenta: {
        color: "green",
        fontSize: 22,
        fontWeight: "bold"
    },
    fechaActualizacion: {
        fontSize: 12,
        color: "gray",
        marginBottom: 16,
    },
    botonesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
        marginBottom: 16,
    },
    boton: {
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 8,
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 12,
    },
    textoBoton: {
        paddingLeft: 30,
        paddingRight: 30,
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default ProductDetailScreen;

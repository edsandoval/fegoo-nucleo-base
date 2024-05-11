import React, {useEffect, useState} from 'react';
import {View, TextInput, Button, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import {DEFAULT_VENTA_POR} from '../../model/producto';

const Counter = ({onChange, count, venta, unidad}) => {
    const [cantidad, setCantidad] = useState(0);

    const abreviaturas  = {
        'Kilogramos': 'Kg.',
        'Litros': 'L.',
        'Gramos': 'gr.',
        'Mililitros': 'ml.'
    }

    const unidadAbreviada = abreviaturas[unidad];

    useEffect(() => {
        setCantidad(count);
    }, [count]);

    const restarCantidad = () => {
        if (cantidad > 0) {
            setCantidad(cantidad - 1);
            onChange(cantidad - 1);
        }
    };

    const sumarCantidad = () => {
        if (cantidad < 20) {
            setCantidad(cantidad + 1);
            onChange(cantidad + 1);
        }
    };

    const renderMinusButton = () => {
        return (
            <TouchableOpacity style={styles.button} onPress={restarCantidad}>
                <Icon name="minus" size={15} color="white" />
            </TouchableOpacity>
        );
    }

    const renderPlusButton = () => {
        return (
            <TouchableOpacity style={styles.button} onPress={sumarCantidad}>
                <Icon name="plus" size={15} color="white" />
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            { unidad === DEFAULT_VENTA_POR ? (
                <>
                    {renderMinusButton()}
                    <TextInput
                        style={styles.input} 
                        keyboardType="numeric"
                        value={cantidad.toString()}
                        editable={false}
                        onChangeText={(text) => {
                            const value = parseInt(text, 9) || 0;
                            if (value >= -1 && value <= 20) {
                                setCantidad(value);
                                onChange(value);
                            }
                        }}
                    />
                    {renderPlusButton()}
                </>
            ) : (
                <View style={{
                    position: 'absolute',
                    top: -36,
                    left: -120,
                    flexDirection: 'row',
                    }}>
                    <Text style={styles.label}>{venta} {unidadAbreviada}</Text>
                    {renderMinusButton()}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        marginHorizontal: 8,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        borderWidth: 1,
        borderRadius: 5,
    },
    label: {
        fontSize: 18,
        color: 'blue',
        textAlign: 'center',
        marginHorizontal: 8,
    },
    button: {
        width: 24,
        height: 24,
        borderRadius: 20,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
    },
});

export default Counter;

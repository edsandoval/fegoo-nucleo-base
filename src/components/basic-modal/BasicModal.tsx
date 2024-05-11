import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {View, Text, TextInput, Modal, TouchableOpacity, StyleSheet} from 'react-native';

export type ModalProps = {
    visible: boolean;
    text: string;
    onClose: () => void;
    onConfirm: (value: number) => void;
};

const BasicModal = ({visible, text, onClose, onConfirm}: ModalProps) => {
    const [inputValue, setInputValue] = useState('');
    const isFocused = useIsFocused();

    useEffect(() => {
        setInputValue('');
    }, [isFocused]);

    const handleConfirm = () => {
        const numericValue = parseFloat(inputValue);
        if (!isNaN(numericValue)) {
            onConfirm(numericValue);
        }
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.textPrompt}>{text}</Text>

                    <TextInput
                        keyboardType="numeric"
                        style={styles.input}
                        value={inputValue}
                        onChangeText={setInputValue}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.toButton} onPress={onClose}>
                            <Text style={styles.textButton}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.toButton} onPress={handleConfirm}>
                            <Text style={styles.textButton}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },
    textPrompt: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        width: 100,
        borderRadius: 8,
        paddingHorizontal: 8,
        fontSize: 20,
        borderColor: "green",
        borderWidth: 4
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 40,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#2196F3',
    },
    toButton: {
        backgroundColor: '#2196F3',
        borderRadius: 14,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1
    },
    textButton: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 12,
    },
});

export default BasicModal;

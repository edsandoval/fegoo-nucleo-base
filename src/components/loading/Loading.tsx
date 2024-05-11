import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loading = ({loading}: any) => {
    if (!loading) {
        return null;
    }

    return (
        <View style={styles.overlay}>
            <ActivityIndicator size="large" color="green" />
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Loading;

import AsyncStorage from "@react-native-async-storage/async-storage";

const KeyValueStorage = {
    get: async (key: string) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                console.log('Datos obtenidos correctamente');
                return value;
            }
        } catch (error) {
            console.error('Error al obtener datos: ', error);
        }
    },

    set: async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
            console.log('Datos guardados correctamente');
        } catch (error) {
            console.error('Error al guardar datos: ', error);
        }
    },
}

export default KeyValueStorage;

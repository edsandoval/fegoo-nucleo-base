import React, {useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'

const UpdateIndicator = ({item}: any) => {
    const [color, setColor] = useState<string>('red');

    useEffect(() => {
        const fechaActual = new Date();
        const fechaUltimaActualizacion = new Date(item.fecha_actualizacion);
        const diferencia = differenceInDays(fechaUltimaActualizacion, fechaActual);

        if (diferencia < 7) {
            setColor('green');
        } else if (diferencia < 14) {
            setColor('orange');
        } else {
            setColor('red');
        }
    }, [item]);

    const differenceInDays = (fechaInicial: Date, fechaFinal: Date) => {
        const diferenciaEnMilisegundos = fechaFinal.getTime() - fechaInicial.getTime();
        const diferenciaEnDias = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

        return diferenciaEnDias;
    };


    return (
        <Icon name="check-circle" size={25} color={color} />
    );
};

export default UpdateIndicator;

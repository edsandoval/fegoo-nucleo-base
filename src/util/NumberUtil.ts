

const NumberUtil = {

    round10: (num: number) => {
        return Math.ceil(num / 10) * 10;
    },

    fixed2: (num: number) => {
        return Number(num.toFixed(2));
    },

    applyPercent: (precioLista: any, porcentaje: number) => {
        const nPrecioLista = parseFloat(precioLista);
        const pPrecioLista = Number((nPrecioLista * porcentaje) / 100);
        const pPrecioFinal = Number((nPrecioLista + pPrecioLista).toFixed(2))

        return NumberUtil.round10(pPrecioFinal);
    }

}

export default NumberUtil;

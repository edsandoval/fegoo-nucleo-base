
export interface Producto {
    id: number;
    nombre: string;
    precio_lista: number;
    precio_final: number;
    porcentaje: number;
    categoria_id: number;
    proveedor_id: number;
    venta_por: string;
    unidad_referencia: number;
    imagen: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
    cantidad: number;
    venta_por_unidad: number;
}

export const DEFAULT_VENTA_POR: string = 'Unidad';
export const DEFAULT_UNIDAD_REFERENCIA: string = '1';

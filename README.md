# Nucleo - Mobile Price Tracker

![Nucleo Logo](https://example.com/nucleo-logo.png)

## Overview

Nucleo is a mobile application developed using React Native and Expo for the frontend, and Supabase as the backend to support data storage. The primary objective of this project is to provide a proof of concept for a mobile price tracking application. Nucleo aims to display product prices from a specific establishment, categorized by suppliers. The goal is to automatically update prices when a supplier adjusts the cost of a product.

## Version

Current Version: 0.0.2-alpha1

## Features

- **Real-time Price Updates:** Nucleo ensures that the displayed prices are always up-to-date by automatically fetching and updating data from Supabase.
- **Supplier-wise Product Categorization:** Easily view and compare product prices based on different suppliers within the establishment.

## Technologies Used

- React Native
- Expo
- Supabase

## Installation

1. Clone the repository: `git clone https://github.com/edsandoval/nucleo.git`

1. Install [node.js](https://nodejs.org/en/)
2. Install Expo

   ```jsx
   npm install --global expo-cli
   ```

3. Download this repo
4. Install deps on your template folder

   ```jsx
   npm install
   ```

5. Start the environtment

   ```jsx
   expo start
   ```

## Build EXPO
```jsx
eas build -p android --profile preview


## Build Local

npx expo run:android
```

### Supabase Setup

- Set up a new Supabase.io project
- Fill your supabase credentials to your config inside `./src/initSupabase.ts`
- You can find your supabase credentials in your project -> settings -> API

  ```jsx
  const supabaseUrl = ........
  const supabaseKey = ........
  // Better put your these secret keys in .env file
  export const supabase = createClient(
  	"supabaseUrl", "supabaseKey",
  	{
  		localStorage: AsyncStorage as any,
  	}
  );
  ```

and you good to go!

## Usage

1. Launch the application on your mobile device or emulator.
2. Explore product prices categorized by suppliers.
3. Experience real-time updates when supplier prices change.

## Download

Download the latest version of Nucleo for Android: [Download APK](https://expo.dev//accounts/fegoo-dev/projects/nucleo/builds/8111c5e0-a553-4afe-9a3e-f88c5e07f107)

## License

This project is licensed under the [MIT License](LICENSE.md).

# Núcleo - Registro de Actualizaciones

## Version 0.0.1-alpha1
- Listado de proveedores.
- Listado de productos por proveedor.
- Funcionalidad de Login.
- Registro de nuevos usuarios.

## Version 0.0.1-alpha2
- Agregada fecha de actualización de cada producto.
- Utilización de la fecha para marcar el producto en 3 niveles de actualización (tilde verde, tilde naranja y tilde rojo).

## Version 0.0.1-alpha4
- Implementación de lupa de búsqueda.
- Edición básica del producto.
- Grabado de porcentaje de ganancias asociado a cada producto.

## Version 0.0.1-beta
- Mejora en la edición del producto.
- Calculadora de productos.
- Mejoras en la funcionalidad de búsqueda.
- Soporte para crear nuevos productos por proveedor.
- Soporte para productos pesables (por ejemplo, fiambres, quesos, verduras, etc.).

## Version 0.0.1-beta (Revisión)
- Mejoras adicionales en la edición del producto(Ahora se puede editar el nombre del producto).
- Corrección de errores detectados(issue de la papa).
- Soporte para eliminar productos.
- Ampliación del botón para agregar productos a la calculadora.
- Mejoras en el modal de productos pesables(aparecian varios modales a la vez).

## Version 0.0.2-alpha1
- Implementación base de actualizacion automatica(Mas que nada pruebas de concepto)
- Mejoras para soportar productos duplicados.


## Contact

For inquiries, reach out to [sandoval.e.d@gmail.com](mailto:sandoval.e.d@gmail.com)
🚀 Happy tracking! 📱💰

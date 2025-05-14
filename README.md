# MañoComponentes E-commerce (MERN Stack)

Una aplicación web para la venta de componentes informáticos construida con el stack MERN (MongoDB, Express, React, Node.js).

## Características

- Registro y autenticación de usuarios
- Página de inicio pública
- Catálogo de productos
- Panel de usuario

## Requisitos

- Node.js
- MongoDB
- npm o yarn

## Instalación

1. Clona el repositorio
2. Instala las dependencias del servidor:
   ```bash
   cd server
   npm install
   ```
3. Instala las dependencias del cliente:
   ```bash
   cd client
   npm install
   ```

## Configuración

1. Crea un archivo `.env` en la carpeta server con las siguientes variables:
   ```
   MONGODB_URI=tu_uri_de_mongodb
   JWT_SECRET=tu_secreto_jwt
   PORT=5000
   ```

## Ejecución

1. Inicia el servidor:
   ```bash
   cd server
   npm start
   ```

2. Inicia el cliente:
   ```bash
   cd client
   npm start
   ```

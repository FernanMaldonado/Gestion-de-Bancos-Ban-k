# Gestión de Bancos - Ban-k

Este repositorio contiene la lógica de **backend** para el sistema bancario **Ban-k**, desarrollado con **Node.js**, **Express** y **MongoDB**.

## Requisitos

- Node.js >= 18  
- MongoDB en ejecución local

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/FernanMaldonado/Gestion-de-Bancos-Ban-k.git
```
```bash
cd Gestion-de-Bancos-Ban-k
```
2. Instalar dependencias

```bash
npm install
```
3. Crear archivo .env para funcionamiento y definicion del puerto y url de Mongo
```bash
PORT=3001
NODE_ENV=development
URI_MONGODB=mongodb://localhost:27017/gestion-Banco-Ban-k
JWT_SECRET=miClaveSuperSecreta123
```
4. Ejecutar comando en bash
```bash
node index.js
```

## Como registro de url para cada modulo y prueba

# Administradores
Metodo Post Y Get / Administradores  / Agregar y Consultar
```bash
/Ban-k/v1/admins
```
Metodo Get Y Put / Administradores / Buscar, Actualizar
```bash
/Ban-k/v1/admins/:id
```
Metodo Put / Administradores / Activar y desactivar cuentas
- Activar
```bash
/Ban-k/v1/admins/:id/activate
```
- Desactivar
```bash
/Ban-k/v1/admins/:id/deactivate
```
# Login
Metodo Post / Login de Usuarios
```bash
/Ban-k/v1/login/login
```
Metodo Post / Login de Administradores
```bash
/Ban-k/v1/login/loginAdmin
```
# Transsaciones
Metodo Post Y Get / Transacciones / Agregar y Consultar
```bash
/Ban-k/v1/transacciones
```
# Usuarios
Metodo Post Y Get / Usuarios  / Agregar y Consultar
```bash
/Ban-k/v1/usuarios
```
Metodo Get, Put y Delete / Usuarios / Buscar, Actualizar y Eliminar
```bash
/Ban-k/v1/usuarios/:id
```

# Cuentas
Metodo Post Y Get / Cuentas  / Agregar y Consultar
```bash
/Ban-k/v1/cuentas
```
Metodo Get Y Put / Cuentas / Buscar, Actualizar, Activar y desactivar cuentas
```bash
/Ban-k/v1/cuentas/:id
```

Metodo Put / Cuentas / Activar y desactivar cuentas
- Activar
```bash
/Ban-k/v1/cuentas/:id/activar
```
- Desactivar
```bash
/Ban-k/v1/cuentas/:id/desactivar
```

## Ejemplos de agregar datos en cada modulo: JSON
- Administradores
```bash
{
  "name": "Juan Pérez",
  "email": "juan.perez@bank.com",
  "password": "MiClaveSuperSecreta123",
  "status": "active",
  "creationDate": "2026-02-15T19:00:00.000Z"
}

```

- Cuentas
```bash
{
  "nombreCompleto": "Fernando Perez",
  "documentoIdentidad": "1234567890101",
  "telefono": "55551234",
  "correo": "fernando.perez@correo.com",
  "tipoCuenta": "Ahorros",
  "numeroCuenta": "1234567890",
  "saldo": 1000.50
}

```

- Transacciones
```bash
{
  "idFromUsuario": "641a1f5e8c1a3c00123abcd1",
  "idToUsuario": "641a1f5e8c1a3c00123abcd2",
  "amount": 250.75,
  "date": "2026-02-15T19:10:00.000Z",
  "type": "transferencia",
  "description": "Pago de servicios"
}

```

- Usuarios
```bash
{
  "name": "Javier Perez",
  "email": "javier.Perez@correo.com",
  "password": "ClaveSegura123",
  "phone": "55567890",
  "dpi": "1234567890101",
  "address": "Calle Principal 123, Ciudad",
  "job_name": "Ingeniero de Sistemas",
  "monthly_income": 1500.75,
  "birthdate": "1995-06-15T00:00:00.000Z",
  "createdAt": "2026-02-15T19:20:00.000Z"
}

```

## Hay un administrador creado por default
```bash
{
    email: 'ADMIN01@gmail.com',
    password: 'ADMIN01'
}
```





 

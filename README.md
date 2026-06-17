# Sistema de Pagos – API REST

Sistema de pagos con Node.js, PostgreSQL y Python.

## Requisitos
- Node.js 18+
- Python 3.10+
- PostgreSQL 15+

## Instalación

Desde la raíz de la app:

### 1. Base de datos
```bash
psql -U postgres -c "CREATE DATABASE payment_db;"
psql -U postgres -d payment_db -f database/init.sql
```
O también se puede crear la BD desde un gestor (pgAdmin) y luego ejecutar el script:
```
psql -U postgres -d payment_db -f database/init.sql
```

### 2. Servicio Python
```bash
cd payment-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --port 8000    # Para correr el servicio de python
```

### 3. API Node.js

Abrir una nueva terminal

```bash
cd api-node
```
Crear el archivo .env con la estructura: 

```bash
PORT=3000
DB_HOST=localhost
DB_PORT=5432             # Tu puerto del servidor de base de datos
DB_USER=postgres         # Tu usuario del servidor de base de datos
DB_PASSWORD=postgres     # Tu contraseña del servidor de base de datos
DB_NAME=payment_db
PAYMENT_SERVICE_URL=http://localhost:8000
```

```bash
yarn install
yarn dev          # Para correr la api de node
```

## Endpoints disponibles

| Método | URL                      | Descripción                    |
| ------ | ------------------------ | ------------------------------ |
| POST   | `/usuarios`              | Crear usuario                  |
| GET    | `/usuarios`              | Listar usuarios                |
| GET    | `/usuarios/:id`          | Obtener usuario por ID         |
| POST   | `/usuarios/:id/tarjetas` | Registrar tarjeta              |
| GET    | `/usuarios/:id/tarjetas` | Listar tarjetas del usuario    |
| POST   | `/pagos`                 | Crear un pago                  |
| GET    | `/usuarios/:id/pagos`    | Historial de pagos del usuario |

### Colección de Postman:

[Link de la colección](https://sanchezibrahim296-4676428.postman.co/workspace/Ibrahim-S%C3%A1nchez's-Workspace~25a97da2-19e6-4869-8ef5-e3ff0f144487/collection/55968053-3d3e5b39-1b62-4453-8424-9badd41cabaa?action=share&source=copy-link&creator=55968053)

En la carpeta `postman` se encuentra el archivo para importar la colección en caso de que se quiera importar de forma manual
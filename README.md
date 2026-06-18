# Sistema de Pagos – API REST

API de pagos construida con Node.js (Express + Sequelize), PostgreSQL y Python (FastAPI).

## Descripción

Este proyecto consiste en un backend para gestionar usuarios, tarjetas y pagos. La API de Node.js expone los endpoints principales y delega el procesamiento de pago a un microservicio Python.

## Requisitos
- Node.js 18+
- Yarn
- Python 3.10+
- PostgreSQL 15+

## Estructura del proyecto

- `api-node/`: API principal en Node.js
- `database/init.sql`: script de inicialización de la base de datos
- `payment-service-python/`: microservicio de pagos en Python
- `postman/`: colección de Postman para probar la API

## Instalación

Desde la raíz del proyecto:

### 1. Base de datos

```bash
psql -U postgres -c "CREATE DATABASE payment_db;"
psql -U postgres -d payment_db -f database/init.sql
```

Si prefieres usar un gestor gráfico, crea la base de datos y luego ejecuta:

```bash
psql -U postgres -d payment_db -f database/init.sql
```

### 2. Servicio Python

```bash
cd payment-service-python
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

El servicio Python quedará disponible en:

- `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

### 3. API Node.js

Abre una nueva terminal y ejecuta:

```bash
cd api-node
yarn install
```

Crea el archivo `.env` con la siguiente estructura:

```bash
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=payment_db
PAYMENT_SERVICE_URL=http://localhost:8000
```

Luego inicia la API:

```bash
yarn dev
```

La API Node.js quedará disponible en:

- `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`

> La ruta `/` redirige automáticamente a `/docs`.

## Endpoints disponibles

| Método | URL                              | Descripción                         |
| ------ | -------------------------------- | ----------------------------------- |
| POST   | `/usuarios`                      | Crear usuario                       |
| GET    | `/usuarios`                      | Listar usuarios                     |
| GET    | `/usuarios/:id`                  | Obtener usuario por ID              |
| PATCH  | `/usuarios/:id`                  | Actualizar usuario                  |
| DELETE | `/usuarios/:id`                  | Eliminar usuario                    |
| POST   | `/usuarios/:id/tarjetas`         | Registrar tarjeta                   |
| GET    | `/usuarios/:id/tarjetas`         | Listar tarjetas del usuario         |
| GET    | `/usuarios/:id/tarjetas/:tarjeta_id` | Obtener tarjeta por ID          |
| PATCH  | `/usuarios/:id/tarjetas/:tarjeta_id` | Actualizar tarjeta             |
| POST   | `/pagos`                         | Crear un pago                       |
| GET    | `/usuarios/:id/pagos`            | Historial de pagos del usuario      |
| GET    | `/health`                        | Verificar estado del servicio       |

## Swagger / OpenAPI

- Documentación Node.js: `http://localhost:3000/docs`
- Documentación Python: `http://localhost:8000/docs`

## Colección de Postman

La colección se encuentra en la carpeta `postman`.

### Importar colección manualmente

1. Abre Postman.
2. Importa el archivo `postman/PT-API.postman_collection.json`.
3. Utiliza los endpoints contra `http://localhost:3000`.

## Notas adicionales

- La API Node.js usa Sequelize para acceder a PostgreSQL.
- El microservicio Python simula la aprobación de pagos con respuesta aleatoria.
- Las relaciones entre tablas están configuradas para eliminar en cascada cuando se borra un usuario o tarjeta.

## Problemas comunes

- Si `yarn dev` no arranca, verifica que el `.env` tenga los datos correctos y que el servicio Python esté activo.
- Si hay errores de conexión a PostgreSQL, confirma que `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME` sean correctos.

## Uso con Docker Compose

Desde la raíz del proyecto ejecuta:

```bash
docker compose up --build
```

Esto levantará:

- PostgreSQL en `localhost:5432`
- servicio Python en `localhost:8000`
- API Node.js en `localhost:3000`

> Si tienes PostgreSQL corriendo localmente en la misma máquina, puede haber un conflicto de puerto en `5432`.
> En ese caso detén el servicio PostgreSQL local antes de correr el Compose, o bien elimina los contenedores actuales y vuelve a levantar el stack:

```bash
docker compose down
# detener postgres local si está activo, por ejemplo `sudo systemctl stop postgresql`
docker compose up --build
```

Si sigues teniendo conflicto, revisa que no haya otro proceso usando el puerto `5432`.

## Recomendaciones de mejoras futuras

- Autenticación y autorización: incorporar JWT o sesiones para proteger los endpoints y permitir acciones solo a usuarios autenticados.
- Encriptación de datos sensibles: cifrar el número de tarjeta y otros datos sensibles en la base de datos.
- Manejo de errores centralizado: un middleware de manejo de errores para respuestas consistentes y mejores logs.
- Tests automatizados: añadir pruebas unitarias e integración para los controladores y servicios de pago.
- Mejoras en el microservicio de pagos: implementar flujos reales de aprobación, reintentos y auditoría de transacciones.
- Monitoreo y métricas: integrar herramientas de observabilidad para saber el estado del servicio en producción.

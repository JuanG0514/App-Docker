# 🏪 Sistema de Inventario — Despliegue con Docker

Aplicación web completa de gestión de inventario desplegada con contenedores Docker sin docker-compose.
Arquitectura de tres capas: **React + Vite** (frontend) → **Spring Boot** (backend) → **MySQL** (base de datos).

---

## 🧰 Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 5, Axios |
| Servidor web | Nginx (proxy inverso incluido) |
| Backend | Spring Boot 3.2, Spring Data JPA |
| Base de datos | MySQL 8.0 |
| Contenerización | Docker (multi-stage builds) |

---

## 📁 Estructura del repositorio

```
/
├── back/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/inventario/api/
│   │       │   ├── ApiApplication.java
│   │       │   ├── config/CorsConfig.java
│   │       │   ├── controller/ProductoController.java
│   │       │   ├── model/Producto.java
│   │       │   ├── repository/ProductoRepository.java
│   │       │   └── service/ProductoService.java
│   │       └── resources/
│   │           └── application.properties
│   ├── Dockerfile
│   ├── init.sql
│   └── pom.xml
├── front/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductoForm.jsx
│   │   │   └── ProductoList.jsx
│   │   ├── services/
│   │   │   └── productoService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Despliegue paso a paso

> **Requisito previo:** tener Docker instalado y corriendo.  
> Ejecuta todos los comandos desde la **raíz del repositorio**.

---

### Paso 1 — Crear las redes Docker

Se necesitan dos redes: una entre frontend y backend, y otra entre backend y base de datos.

```bash
docker network create red-front-back
docker network create red-back-bd
```

Verificar que se crearon:

```bash
docker network ls
```

---

### Paso 2 — Crear el volumen para la base de datos

El volumen persiste los datos aunque el contenedor se elimine.

```bash
docker volume create volumen-mysql
```

Verificar:

```bash
docker volume ls
```

---

### Paso 3 — Construir la imagen del Backend

```bash
docker build -t imagen-backend ./back
```

> Este proceso descarga las dependencias de Maven y compila el JAR.  
> La primera vez puede tardar 3-5 minutos.

---

### Paso 4 — Construir la imagen del Frontend

```bash
docker build -t imagen-frontend ./front
```

> Instala dependencias npm y ejecuta `vite build` para generar los archivos estáticos.

---

### Paso 5 — Ejecutar el contenedor de Base de Datos

```bash
docker run -d \
  --name bd \
  --network red-back-bd \
  -e MYSQL_ROOT_PASSWORD=root1234 \
  -e MYSQL_DATABASE=inventario_db \
  -e MYSQL_USER=inventario_user \
  -e MYSQL_PASSWORD=inventario_pass \
  -v volumen-mysql:/var/lib/mysql \
  -p 3306:3306 \
  mysql:8.0
```

Esperar ~20 segundos a que MySQL termine de iniciar. Verificar que está listo:

```bash
docker logs bd
```

Cuando veas `ready for connections` en los logs, continúa al siguiente paso.

---

### Paso 6 — Ejecutar el contenedor del Backend

```bash
docker run -d \
  --name backend \
  --network red-back-bd \
  -p 3000:3000 \
  imagen-backend
```

Conectar también el backend a la red del frontend:

```bash
docker network connect red-front-back backend
```

Verificar que Spring Boot arrancó correctamente:

```bash
docker logs backend
```

Debes ver: `Started ApiApplication` en los logs.

---

### Paso 7 — Ejecutar el contenedor del Frontend

```bash
docker run -d \
  --name frontend \
  --network red-front-back \
  -p 80:80 \
  imagen-frontend
```

---

### Paso 8 — Verificar que todo funciona

```bash
docker ps
```

Deberías ver los tres contenedores (`bd`, `backend`, `frontend`) con estado `Up`.

Abre el navegador en: **http://localhost**

---

## 🔍 Comandos útiles de verificación

```bash
# Ver logs de cualquier contenedor
docker logs bd
docker logs backend
docker logs frontend

# Inspeccionar las redes
docker network inspect red-front-back
docker network inspect red-back-bd

# Probar el API directamente
curl http://localhost:3000/productos
curl http://localhost/api/productos
```

---

## 🗄️ Conectar con MySQL Workbench (opcional)

Como el contenedor `bd` expone el puerto `3306`, puedes conectarte desde MySQL Workbench:

| Campo | Valor |
|-------|-------|
| Host | 127.0.0.1 |
| Puerto | 3306 |
| Usuario | inventario_user |
| Contraseña | inventario_pass |
| Base de datos | inventario_db |

> También puedes ejecutar el script `back/init.sql` en Workbench para insertar datos de ejemplo.

---

## 🧹 Limpieza (eliminar todo)

```bash
# Detener y eliminar contenedores
docker stop frontend backend bd
docker rm frontend backend bd

# Eliminar imágenes
docker rmi imagen-frontend imagen-backend

# Eliminar redes
docker network rm red-front-back red-back-bd

# Eliminar volumen (ATENCIÓN: borra todos los datos)
docker volume rm volumen-mysql
```

---

## 🏗️ Arquitectura

```
Usuario
  │
  ▼
[frontend :80]  ──── red-front-back ────  [backend :3000]
  Nginx                                    Spring Boot
  React SPA                                    │
  Proxy /api/ ─────────────────────────────────┘
                                               │
                                    red-back-bd
                                               │
                                         [bd :3306]
                                           MySQL
                                       volumen-mysql
```

---

## 📡 Endpoints del API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/productos` | Listar todos |
| GET | `/productos/{id}` | Obtener por ID |
| POST | `/productos` | Crear producto |
| PUT | `/productos/{id}` | Actualizar producto |
| DELETE | `/productos/{id}` | Eliminar producto |

**Ejemplo de cuerpo para POST/PUT:**
```json
{
  "nombre": "Laptop Dell",
  "descripcion": "Intel Core i5, 8GB RAM",
  "precio": 2800000,
  "stock": 10,
  "categoria": "Electrónica"
}
```

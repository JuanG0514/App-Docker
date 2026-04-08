# Sistema de Inventario — Despliegue con Docker

Este proyecto es una aplicación web para gestionar inventarios.
Está construida con una arquitectura de tres capas usando contenedores Docker:

* Frontend (React)
* Backend (Spring Boot)
* Base de datos (MySQL)

Todo se ejecuta con Docker, sin usar docker-compose.

---

## Tecnologías utilizadas

| Parte         | Tecnología        |
| ------------- | ----------------- |
| Frontend      | React 18 + Vite 5 |
| Servidor web  | Nginx             |
| Backend       | Spring Boot 3.2   |
| Base de datos | MySQL 8           |
| Contenedores  | Docker            |

---

## Estructura del proyecto

```bash
/
├── back/
├── front/
└── README.md
```

* `back/` contiene la API en Spring Boot
* `front/` contiene la interfaz en React

---

## Cómo ejecutar el proyecto

**Requisito:** Tener Docker instalado y en ejecución.
Ejecutar todos los comandos desde la raíz del proyecto.

---

### Paso 1 — Crear redes Docker

Se crean dos redes para la comunicación entre contenedores:

```bash
docker network create red-front-back
docker network create red-back-bd
```

Verificar:

```bash
docker network ls
```

---

### Paso 2 — Crear volumen para MySQL

Permite persistir los datos de la base de datos:

```bash
docker volume create volumen-mysql
```

Verificar:

```bash
docker volume ls
```

---

### Paso 3 — Construir imagen del Backend

```bash
docker build -t imagen-backend ./back
```

Este proceso puede tardar unos minutos la primera vez.

---

### Paso 4 — Construir imagen del Frontend

```bash
docker build -t imagen-frontend ./front
```

---

### Paso 5 — Levantar la Base de Datos

En Windows se recomienda ejecutar en una sola línea:

```bash
docker run -d --name bd --network red-back-bd -e MYSQL_ROOT_PASSWORD=root1234 -e MYSQL_DATABASE=inventario_db -e MYSQL_USER=inventario_user -e MYSQL_PASSWORD=inventario_pass -v volumen-mysql:/var/lib/mysql -p 3307:3306 mysql:8.0
```

Esperar unos segundos a que inicie.

Verificar:

```bash
docker logs bd
```

Cuando aparezca el mensaje:

```
ready for connections
```

la base de datos está lista.

---

### Paso 6 — Levantar el Backend

```bash
docker run -d --name backend --network red-back-bd -p 3000:3000 imagen-backend
```

Conectar el backend a la red del frontend:

```bash
docker network connect red-front-back backend
```

Verificar:

```bash
docker logs backend
```

Debe aparecer:

```
Started ApiApplication
```

---

### Paso 7 — Levantar el Frontend

```bash
docker run -d --name frontend --network red-front-back -p 80:80 imagen-frontend
```

---

### Paso 8 — Verificar que todo funciona

```bash
docker ps
```

Deben aparecer los contenedores:

* bd
* backend
* frontend

Todos en estado `Up`.

---

## Probar la aplicación

Abrir en el navegador:

```
http://localhost
```

---

## Comandos útiles

Ver logs:

```bash
docker logs bd
docker logs backend
docker logs frontend
```

Ver redes:

```bash
docker network inspect red-front-back
docker network inspect red-back-bd
```

Probar API:

```bash
curl http://localhost:3000/productos
curl http://localhost/api/productos
```

---

## Limpieza (eliminar todo)

```bash
docker stop frontend backend bd
docker rm frontend backend bd

docker rmi imagen-frontend imagen-backend

docker network rm red-front-back red-back-bd

docker volume rm volumen-mysql
```

Este proceso elimina todo, incluyendo los datos de la base de datos.

---

## Arquitectura 

```
Usuario → Frontend (React + Nginx)
        → Backend (Spring Boot)
        → Base de datos (MySQL)
```

El frontend se comunica con el backend, y el backend con la base de datos mediante redes Docker.

---

## Nota final

Este proyecto muestra cómo desplegar una aplicación completa usando Docker de forma manual, sin docker-compose, entendiendo cómo se conectan los contenedores entre sí.

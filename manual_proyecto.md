# 📘 Manual de usuario y desarrollo – ToDoList

Este documento ofrece una guía completa para instalar, ejecutar y utilizar la aplicación **ToDoList**, desarrollada como proyecto final del ciclo de **Desarrollo de Aplicaciones Informáticas**.

---

## 📑 Índice

1. [📝 Descripción general](#descripción-general)

2. [⚙️ Instalación y ejecución](#instalación-y-ejecución)  
   2.1 [🔧 Requisitos previos](#requisitos-previos)  
   2.2 [🌿 Ramas del proyecto](#ramas-del-proyecto)  
   2.3 [📥 Clonación del repositorio](#clonación-del-repositorio)  
   2.4 [⚛️ Frontend - React](#frontend---react)  
   2.5 [🔙 Backend - Symfony API con Docker](#backend---symfony-api-con-docker)  
   2.6 [🚀 Producción (prod)](#producción-prod)

3. [🧭 Uso de la aplicación](#uso-de-la-aplicación)  
   3.1 [🔐 Inicio de sesión / Registro](#inicio-de-sesión--registro)  
   3.2 [🗂️ Gestión de proyectos y tareas](#gestión-de-proyectos-y-tareas)  
   3.3 [📁 Sidebar de proyectos](#sidebar-de-proyectos)  
   3.4 [📌 Tareas](#tareas)  
   3.5 [🔁 Mover tareas](#mover-tareas)  
   3.6 [👥 Asignar tareas](#asignar-tareas)  
   3.7 [❌ Eliminar tareas](#eliminar-tareas)  
   3.8 [👥 Gestión de miembros](#gestión-de-miembros)  
   3.9 [💬 Comentarios](#comentarios)  
   3.10 [✅ Subtareas](#subtareas)

---

## 📝 Descripción general

**ToDoList** es un proyecto desarrollado para la organización de tareas y trabajo colaborativo.

Permite crear proyectos con sus respectivas tareas, añadir usuarios a un proyecto, asignarles tareas, editarlas, borrarlas, cambiar su estado, añadir o quitar subtareas, así como comentarios.

---

## ⚙️ Instalación y ejecución

### 🔧 Requisitos previos

- Node.js
- Composer
- Docker y Docker Compose
- Symfony CLI (opcional para desarrollo local)

---

### 🌿 Ramas del proyecto

Este repositorio cuenta con dos ramas principales:

- `master` → pensada para **desarrollo local** (modo dev), usa `localhost`.
- `prod` → configurada para **entorno de producción** (servidores con Nginx y Docker adaptado).

> ⚠️ **Para trabajar en local, asegúrate de estar en la rama `master`.**  
> La rama `prod` no funcionará correctamente en local, ya que depende de una configuración específica de servidor.

---

### 📥 Clonación del repositorio

```bash
git clone https://github.com/JoseMarLop/ToDoList.git
cd ToDoList

# Cambiar a la rama de desarrollo local
git checkout master


Nos movemos a  la carpeta ToDoList/Front_ToDoList

npm install
npm run dev
Ya tenemos corriendo el frontend

Nos movemos a  la carpeta ToDoList/Api_ToDoList

docker compose up -d --build
```

---

## 🧭 Uso de la aplicación

### 🔐 Inicio de sesión / Registro

Al acceder por primera vez, serás recibido por una **página de bienvenida** donde se presenta brevemente la funcionalidad general de la aplicación.

Para iniciar sesión o registrarte, haz clic en el **icono de usuario** ubicado en el encabezado (header). Desde ahí podrás elegir entre:

- Crear una cuenta (registro)
- Iniciar sesión si ya estás registrado

> En caso de registro exitoso, el sistema redirige automáticamente a la pantalla de inicio de sesión.  
> Si ocurre un error, se mostrará un mensaje informativo correspondiente.

Una vez logueado:

- Al hacer clic en el icono de usuario, se mostrará tu correo electrónico y la opción **"Cerrar sesión"**.
- Aparecerá un nuevo icono desde el cual podrás **cambiar tu correo electrónico y contraseña**.

---

### 🗂️ Gestión de proyectos y tareas

Una vez autenticado, accederás al **Dashboard principal**, que incluye:

#### 📁 Sidebar de proyectos

- En el lateral izquierdo encontrarás un panel con la lista de proyectos disponibles.
- Los proyectos se dividen en dos secciones:
  - **Mis proyectos**: aquellos creados por el usuario actual.
  - **Equipos**: proyectos en los que el usuario ha sido añadido como miembro.
- Para **crear un nuevo proyecto**, haz clic en el botón de "Agregar proyecto", introduce un nombre (obligatorio) y una descripción (opcional), y guarda los cambios.
- Al seleccionar un proyecto, aparecerá un **icono de lápiz** junto a su nombre que permite:
  - **Editar** el nombre o la descripción
  - **Eliminar** el proyecto

---

#### 📌 Tareas

- Las tareas se crean desde el botón **"Agregar tarea"** situado en la zona central del dashboard.
- Para editar una tarea, haz clic sobre ella. Desde esa vista podrás:
  - Cambiar el **nombre**, la **descripción** o la **prioridad**
  - Guardar los cambios haciendo clic en **"Guardar"**

##### 🔁 Mover tareas

- Las tareas pueden moverse entre columnas mediante **arrastrar y soltar (drag & drop)**.

##### 👥 Asignar tareas

- Para asignar una tarea a un miembro del proyecto:
  - Haz clic en **"Asignar"**
  - Introduce el correo electrónico del usuario
  - Pulsa **Enter** para confirmar

##### ❌ Eliminar tareas

- Haz clic en **"Eliminar"**
- Confirma la acción cuando se te solicite

---

### 👥 Gestión de miembros

- Para ver los miembros de un proyecto, haz clic en la pestaña **"Miembros"** dentro del proyecto.
- Desde allí podrás:
  - **Añadir usuarios** introduciendo su correo electrónico (debe ser un usuario registrado)
  - **Eliminar miembros** haciendo clic sobre su nombre
  - **Otorgar permisos de administrador** activando el checkbox correspondiente

> Los administradores, además del propietario, pueden **editar el proyecto** y **gestionar los miembros**.

---

### 💬 Comentarios

- Los comentarios se añaden desde el interior de una tarea, escribiéndolos en el campo correspondiente y pulsando Enter.
- También se registra automáticamente un comentario cada vez que una tarea es **movida entre columnas** por un usuario.

---

### ✅ Subtareas

- Para añadir subtareas, accede a una tarea y haz clic en **"Agregar subtarea"**
- Para eliminar una subtarea, utiliza el **icono de papelera** que aparece junto a ella

---

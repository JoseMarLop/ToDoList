# 📝 ToDolist

**ToDoList** es una aplicación web tipo Kanban board desarrollada como proyecto final del ciclo formativo de **Desarrollo de Aplicaciones Web**.

Permite gestionar tareas de forma visual e intuitiva, facilitando la organización de trabajo personal o en equipo.

---

## 🚀 Tecnologías utilizadas

- **Frontend:** [React](https://reactjs.org/)
    - CoreUI
    - i18
    - Dnd-kit
    - Sass/Bootstrap
- **Backend:** [Symfony](https://symfony.com/)
    - Jwt security
    - Nelmio
    - Doctrine ORM
- **Infraestructura y despliegue:**
  - Docker (contenedorización)
  - AWS EC2 (servidor en la nube)
  - Mysql

---

## 🧩 Funcionalidades principales

- Organizar tableros propios y por equipos
- Crear, editar y eliminar tareas
- Organizar tareas por columnas estilo Kanban
- Cambiar tareas de estado arrastrando (drag & drop)
- Diferentes opciones para las tareas, como subtareas y comentarios
- Sincronización con backend para persistencia

---

## ⚙️ Estructura del proyecto

```
todolist/
├── frontend/             # React app (cliente)
│   └── src/
│       └── ...
├── api/                  # Symfony app (servidor/API)
│   ├── src/
│   ├── Dockerfile
│   └── docker-compose.yml
├── README.md             # Este archivo
└── manual.md             # Instrucciones para correr el proyecto
```

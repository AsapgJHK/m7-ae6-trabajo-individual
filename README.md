# 🚀 Sistema de Gestión de Proyectos y Tareas

Este proyecto es un ejercicio práctico para comprender e implementar **relaciones entre modelos** ($1:N$ y $N:M$) utilizando **Sequelize ORM** con una base de datos SQLite. Simula un sistema básico donde los proyectos contienen tareas, y los empleados son asignados a dichas tareas.

## 🛠️ Tecnologías Utilizadas

  * **Node.js**: Entorno de ejecución del lado del servidor.
  * **Sequelize**: ORM (Object-Relational Mapper) para Node.js.
  * **SQLite3**: Base de datos ligera utilizada para el desarrollo local.

-----

## 📂 Estructura del Proyecto

El código está organizado en tres archivos principales:

```
gestion_proyectos_tareas/
├── db.js               # Configuración de la conexión a Sequelize.
├── models.js           # Definición de modelos y relaciones.
└── index.js            # Lógica de ejecución, sincronización y operaciones CRUD.
```

-----

## 📦 Modelos y Relaciones Implementadas

El sistema define tres entidades principales y una tabla de unión:

### Modelos

| Modelo | Atributos Clave | Propósito |
| :--- | :--- | :--- |
| **`Proyecto`** | `nombre`, `descripcion` | Contenedor principal de trabajo. |
| **`Tarea`** | `titulo`, `estado` | Unidad de trabajo dentro de un proyecto. |
| **`Empleado`** | `nombre`, `email` (UNIQUE) | Personas asignadas para realizar tareas. |

### Relaciones

1.  **Proyecto ↔ Tarea (Uno a Muchos - 1:N)**:

      * Un proyecto (`Proyecto`) puede tener muchas tareas (`Tarea`).
      * La clave foránea (`ProyectoId`) se encuentra en la tabla `Tareas`.
      * Implementa **Borrado en Cascada (`ON DELETE CASCADE`)**: al eliminar un proyecto, todas sus tareas asociadas se eliminan automáticamente.

2.  **Tarea ↔ Empleado (Muchos a Muchos - N:M)**:

      * Un empleado (`Empleado`) puede trabajar en muchas tareas (`Tarea`), y una tarea puede tener muchos empleados asignados.
      * Se implementa a través de la **Tabla Intermedia `TareasEmpleados`**.

-----

## 🚀 Instalación y Ejecución

Sigue estos pasos para configurar y ejecutar el proyecto:

### 1\. Instalación de Dependencias

Asegúrate de tener Node.js instalado y ejecuta los siguientes comandos en la carpeta raíz del proyecto:

```bash
# Inicializar el proyecto (si no lo has hecho)
npm init -y

# Instalar Sequelize y el driver SQLite
npm install sequelize sqlite3
```

### 2\. Ejecución

El script `index.js` es el punto de entrada que sincroniza la base de datos, ejecuta el CRUD completo y muestra los resultados en consola.

```bash
node index.js
```

### 📋 Operaciones CRUD Demostradas

El archivo `index.js` realiza secuencialmente las siguientes operaciones:

1.  **Creación**: Crea un `Proyecto`, dos `Tareas` y dos `Empleados`.
2.  **Asignación (N:M)**: Asigna los `Empleados` a las `Tareas` utilizando el método `addEmpleados()`.
3.  **Lectura (JOIN)**: Obtiene el `Proyecto` y anida todas sus `Tareas` y los `Empleados` asignados mediante `include`.
4.  **Actualización**: Cambia el `estado` de una `Tarea` de "pendiente" a "completada".
5.  **Eliminación en Cascada**: Elimina el `Proyecto` principal, verificando que las `Tareas` asociadas también se eliminen automáticamente.

-----

## ⚠️ Manejo de Errores

Se incluye un manejo básico de errores (`try...catch...finally`) para las operaciones CRUD. Esto asegura que:

  * Se verifique la existencia de registros antes de intentar actualizar o eliminar.
  * Se detecten y reporten errores comunes de Sequelize (e.g., `SequelizeUniqueConstraintError` si se intenta crear un empleado con un email duplicado).
  * La conexión a la base de datos (`sequelize.close()`) se cierre siempre, independientemente del éxito o fracaso de las operaciones.

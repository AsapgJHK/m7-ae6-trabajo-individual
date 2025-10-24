const { DataTypes } = require('sequelize');

const sequelize = require('./db'); 



const Proyecto = sequelize.define('Proyecto', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_fin: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'Proyectos',
});

const Tarea = sequelize.define('Tarea', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'pendiente',
    validate: {
      isIn: [['pendiente', 'en progreso', 'completada']],
    },
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'Tareas',
});

const Empleado = sequelize.define('Empleado', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'Empleados',
});



const TareasEmpleados = sequelize.define('TareasEmpleados', {
  
}, {
  tableName: 'TareasEmpleados',
  timestamps: false, 
});


Proyecto.hasMany(Tarea, {
  foreignKey: 'ProyectoId',
  onDelete: 'CASCADE',
});

Tarea.belongsTo(Proyecto, {
  foreignKey: 'ProyectoId',
});


Tarea.belongsToMany(Empleado, {
  through: TareasEmpleados,
  foreignKey: 'TareaId',
});

Empleado.belongsToMany(Tarea, {
  through: TareasEmpleados,
  foreignKey: 'EmpleadoId',
});



module.exports = {
  sequelize, 
  Proyecto,
  Tarea,
  Empleado,
  TareasEmpleados,
};
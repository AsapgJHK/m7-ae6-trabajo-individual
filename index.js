const {
  sequelize, 
  Proyecto,
  Tarea,
  Empleado,
} = require('./models');

async function main() {
  try {
    
    await sequelize.sync({ force: true }); 
    console.log('✅ Base de datos sincronizada y tablas creadas (incluyendo clave foránea).');
    console.log('--------------------------------------------------');


 
    const nuevoProyecto = await Proyecto.create({
      nombre: 'Rediseño Web UX',
      descripcion: 'Rediseño completo de la interfaz y experiencia de usuario del sitio web.',
      fecha_inicio: new Date(),
      fecha_fin: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 días después
    });
    console.log(`✅ Proyecto creado: ID ${nuevoProyecto.id} - ${nuevoProyecto.nombre}`);
    console.log('--------------------------------------------------');

   
    const tarea1 = await Tarea.create({
      titulo: 'Investigación de mercado',
      descripcion: 'Análisis de la competencia y tendencias UX/UI.',
      estado: 'en progreso',
      fecha_vencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
      ProyectoId: nuevoProyecto.id, 
    });

    const tarea2 = await Tarea.create({
      titulo: 'Wireframes y Prototipo',
      descripcion: 'Creación de esquemas y prototipo de alta fidelidad.',
      estado: 'pendiente',
      fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
      ProyectoId: nuevoProyecto.id,
    });
    console.log(`✅ Tareas creadas (ID ${tarea1.id} y ${tarea2.id}) y asignadas al Proyecto ${nuevoProyecto.id}.`);
    console.log('--------------------------------------------------');

    
    const empleadoA = await Empleado.create({ nombre: 'Ana Gómez', email: 'ana@example.com' });
    const empleadoB = await Empleado.create({ nombre: 'Juan Pérez', email: 'juan@example.com' });
    console.log(`✅ Empleados creados (ID ${empleadoA.id} y ${empleadoB.id}).`);
    console.log('--------------------------------------------------');

   
    await tarea1.addEmpleados([empleadoA, empleadoB]);
   
    await tarea2.addEmpleado(empleadoA);
    console.log(`✅ Empleados asignados a las tareas (vía tabla intermedia TareasEmpleados).`);
    console.log('--------------------------------------------------');


 
    console.log('➡️ Lectura de Proyectos, sus Tareas y Empleados (uso de Include)...');
    const proyectosConDetalles = await Proyecto.findAll({
      where: { id: nuevoProyecto.id },
      include: [{
        model: Tarea,
        attributes: ['titulo', 'estado'],
       
        include: [{
            model: Empleado,
            attributes: ['nombre'],
            through: { attributes: [] } 
        }]
      }],
    });

    if (proyectosConDetalles.length > 0) {
      console.log('📋 Proyectos encontrados:');
      proyectosConDetalles.forEach(p => {
        console.log(`- Proyecto: ${p.nombre} (${p.descripcion.substring(0, 30)}...)`);
        p.Tareas.forEach(t => {
          const empleadosAsignados = t.Empleados.map(e => e.nombre).join(', ');
          console.log(`  -> Tarea: ${t.titulo} | Estado: ${t.estado} | Asignados: ${empleadosAsignados}`);
        });
      });
    } else {
      console.log('⚠️ No se encontraron proyectos para leer.');
    }
    console.log('--------------------------------------------------');


   
    const tareaAActualizar = await Tarea.findByPk(tarea2.id);
    
    if (tareaAActualizar) {
        await tareaAActualizar.update({ estado: 'completada' });
        console.log(`✅ Tarea ID ${tarea2.id} actualizada. Nuevo estado: ${tareaAActualizar.estado}`);
    } else {
        console.error(`❌ Error: Tarea con ID ${tarea2.id} no encontrada para actualizar.`);
    }
    console.log('--------------------------------------------------');

  
    const proyectoAEliminar = await Proyecto.findByPk(nuevoProyecto.id);

    if (proyectoAEliminar) {
      
      await proyectoAEliminar.destroy();
      console.log(`✅ Proyecto ID ${nuevoProyecto.id} y sus tareas asociadas eliminados (Borrado en Cascada).`);
      
      
      const tareasEliminadas = await Tarea.findAll({ where: { ProyectoId: nuevoProyecto.id } });
      console.log(`   Tareas encontradas después de borrado: ${tareasEliminadas.length}`);
    } else {
        console.error(`❌ Error: Proyecto con ID ${nuevoProyecto.id} no encontrado para eliminar.`);
    }
    console.log('--------------------------------------------------');

  } catch (error) {
    console.error('💥 Ocurrió un error en la operación de la DB:', error.message);
    if (error.name === 'SequelizeUniqueConstraintError') {
        console.error('El error se debe a una restricción de unicidad (por ejemplo, el email del empleado ya existe).');
    }
  } finally {
    
    if (sequelize) {
        await sequelize.close();
        console.log('Base de datos cerrada.');
    }
  }
}

main();
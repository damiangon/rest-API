//pool y porq no conexion - habilita a que exista conexiones paralelas
import { pool } from './database.js';

class LibrosController {
  // Elimina un libro por ISBN
  async eliminarPorISBN(req, res) {
    
    const isbn = req.body.isbn;

    // Verifica si el campo ISBN está presente en la solicitud
    if (!isbn) {
      res.status(400).json({ mensaje: 'Falta el campo ISBN en el cuerpo de la solicitud' });
      return;
    }

    try {
      // Ejecuta una consulta SQL para eliminar un libro por ISBN
      const [result] = await pool.query('DELETE FROM libros WHERE isbn = ?', [isbn]);

      // Comprueba si se eliminó el libro con éxito y responde en consecuencia
      if (result.affectedRows > 0) {
        res.status(404).json({ mensaje: 'Libro eliminado correctamente' });
      } else {
        res.status(404).json({ mensaje: 'No se encontró ningún libro con el ISBN especificado' });
      }
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
      res.status(500).json({ mensaje: 'Error al eliminar el libro' });
    }
  }

  // Obtiene todos los libros
  async getAll(req, res) {
    try {
      // Ejecuta una consulta SQL para obtener todos los libros
      const [result] = await pool.query('SELECT * FROM libros');
      // Responde con la lista de libros
      res.json(result);
    } catch (error) {
      console.error('Error al obtener todos los libros:', error);
    }
  }

  // Obtiene un libro por su ID
  async getOne(req, res) {
    try {
      
      const id = req.body.id;
      // Ejecuta una consulta SQL para obtener un libro por su ID
      const [result] = await pool.query('SELECT * FROM libros WHERE id = ?', [id]);

      // Comprueba si se encontró el libro y responde en consecuencia
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).json({ 'Error': `No se ha encontrado un libro con el ID ingresado: ${id}` });
      }
    } catch (error) {
      console.error('Error al obtener un libro:', error);
    }
  }

  // Agrega un libro
  async add(req, res) {
    try {
      
      const libro = req.body;

      // Valida si se proporcionan todos los campos obligatorios
      if (!libro.nombre || !libro.autor || !libro.categoria || !libro.fechaPublicacion || !libro.isbn) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios en la solicitud' });
      }

      // Ejecuta una consulta SQL para agregar un libro a la base de datos
      const [result] = await pool.query(`
        INSERT INTO libros (nombre, autor, categoria, fechaPublicacion, isbn)
        VALUES (?, ?, ?, ?, ?)`,
        [libro.nombre, libro.autor, libro.categoria, libro.fechaPublicacion, libro.isbn]
      );

      // Responde con el ID del libro insertado
      res.json({ "id insertado": result.insertId });
    } catch (error) {
      console.log('Error al añadir el libro:', error);
      res.status(500).json({ mensaje: 'Error al añadir el libro' });
    }
  }

  // Elimina un libro por su ID
  async delete(req, res) {
    try {
      // Obtiene el libro a eliminar del cuerpo de la solicitud
      const libro = req.body;
      // Ejecuta una consulta SQL para eliminar un libro por su ID
      const [result] = await pool.query('DELETE FROM libros WHERE id = ?', [libro.id]);
      // Responde con la cantidad de registros eliminados
      res.json({ "Registros eliminados": result.affectedRows });
    } catch (error) {
      console.log('Error al eliminar un libro:', error);
    }
  }

  // Actualiza la información de un libro
  async update(req, res) {
    try {
      // Obtiene los datos del libro a actualizar del cuerpo de la solicitud
      const libro = req.body;
      // Ejecuta una consulta SQL para actualizar la información del libro
      const [result] = await pool.query(`
        UPDATE libros
        SET nombre = ?, autor = ?, categoria = ?, fechaPublicacion = ?, isbn = ?
        WHERE id = ?`,
        [libro.nombre, libro.autor, libro.categoria, libro.fechaPublicacion, libro.isbn, libro.id]
      );
      // Responde con la cantidad de registros actualizados
      res.json({ "Registros actualizados": result.changedRows });
    } catch (error) {
      console.log('Error al actualizar un libro:', error);
    }
  }
}

export const libros = new LibrosController();

//pool y porq no conexion - habilita a que exista conexiones paralelas
import { pool } from './database.js';

class LibrosController {

	async eliminarPorISBN(req, res) {
  		const isbn = req.body.isbn; // Suponiendo que el ISBN se pasa en el cuerpo de la solicitud

  		if (!isbn) {
    		res.status(400).json({ mensaje: 'Falta el campo ISBN en el cuerpo de la solicitud' });
    		return;
  			}

  		try {
    	const [result] = await pool.query('DELETE FROM libros WHERE isbn = ?', [isbn]);

    		if (result.affectedRows > 0) {
      // Se eliminó el libro con éxito
      		res.status(200).json({ mensaje: 'Libro eliminado correctamente' });
    		} else {
      // No se encontró ningún libro con el ISBN especificado
      		res.status(404).json({ mensaje: 'No se encontró ningún libro con el ISBN especificado' });
    	}
  			} catch (error) {
    		console.error('Error al eliminar el libro:', error);
    		res.status(500).json({ mensaje: 'Error al eliminar el libro' });
  		}
	}

	
	async getAll(req, res) {
		try {
			const [result] = await pool.query(`SELECT * FROM libros`);
			res.json(result);
		} catch (error) {
			console.error('Error al obtener todos los libros:', error);
		}
	}

	
	async getOne(req, res) {
		const id = req.body.id;
		try {
			const [result] = await pool.query('SELECT * FROM libros WHERE id = ?', [id]);

			if (result.length > 0) {
				// Devuelve el libro ingresado
				res.json(result[0]);
			} else {
				// Devuelve un mensaje de error si no se encuentra el libro
				res.status(404).json({ 'Error': `No se ha encontrado un libro con el ID ingresado: ${id}` });
			}
		} catch (error) {
			console.error('Error al obtener un libro:', error);
		}
	}

	async agregarLibro (req, res) {
  const { nombre, autor, categoria, fechaPublicacion, isbn } = req.body;

  if (!nombre || !autor || !categoria || !fechaPublicacion || !isbn) {
    res.status(400).json({ mensaje: 'Faltan campos obligatorios en la solicitud' });
    return;
  }

  // Verificar si existen campos adicionales no declarados
  const camposEsperados = ['nombre', 'autor', 'categoria', 'fechaPublicacion', 'isbn'];
  const camposAdicionales = Object.keys(req.body).filter(field => !camposEsperados.includes(field));

  if (camposAdicionales.length > 0) {
    res.status(400).json({ mensaje: 'Campos adicionales no válidos: ' + camposAdicionales.join(', ') });
    return;
  }

  try {
    const [result] = await pool.query(`
				INSERT INTO libros(nombre, autor, categoria, fechaPublicacion, isbn)
				VALUES (?, ?, ?, ?, ?)`,
				[libros.nombre, libros.autor, libros.categoria, libros.fechaPublicacion, libros.isbn]
			);

    res.status(201).json({ mensaje: 'Libro agregado correctamente', id_insertado: result.insertId });
  } catch (error) {
    console.error('Error al agregar el libro:', error);
    res.status(500).json({ mensaje: 'Error al agregar el libro' });
  }
}

	async delete(req, res) {
		const libros = req.body;
		try {
			const [result] = await pool.query(`DELETE FROM libros WHERE id = ?`, [libros.id]);
			res.json({ "Registros eliminados": result.affectedRows });
		} catch (error) {
			console.log('Error al eliminar un libro:', error);
		}
	}

	async update(req, res) {
		const libros = req.body;
		try {
			const [result] = await pool.query(`
				UPDATE libros
				SET nombre = ?, autor = ?, categoria = ?, fechaPublicacion = ?, isbn = ?
				WHERE id = ?`,
				[libros.nombre, libros.autor, libros.categoria, libros.fechaPublicacion, libros.isbn, libros.id]
			);
			res.json({ "Registros actualizados": result.changedRows });
		} catch (error) {
			console.log('Error al actualizar un libro:', error);
		}
	}
}

export const libros = new LibrosController();


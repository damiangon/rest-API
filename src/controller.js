//pool y porq no conexion - habilita a que exista conexiones paralelas
import { pool } from './database.js';

class LibrosController {
	
	async getAll(req, res){
		const [result] = await pool.query(`SELECT * FROM libros`);
		res.json(result);
	}

	async getOne(req, res){
			const id = req.body.id;
			const [result] = await pool.query('SELECT * FROM libros WHERE id = ?', [id]);

			if (result.length > 0) {
				//devuelve el libro ingresado
				res.json(result[0]);
			}else{
				//devuelve mensaje de error al no encontrar el libro
				res.status(404).json({"Error": `no se ha encontrado un libro con el id ingresado: ${id}`});
			}
		
	}

	async add(req, res){
		const libros = req.body;
		const [result] = await pool.query (`INSERT INTO libros(nombre, autor, categoria, 
			fechaPublicacion, isbn) VALUES (?, ?, ?, ?, ?)`,[libros.nombre, libros.autor,
				libros.categoria, libros.fechaPublicacion, libros.isbn])
		res.json({"id insertado": result.insertId}); 
		//mensaje para que se entere el usuario q fue insertado el registro

	}

	async delete(req, res){
		const libros = req.body;
		const [result] = await pool.query (`DELETE FROM libros WHERE id=(?)`, [libros.id]);
		res.json({"registros eliminados": result.affectedRows});

	}

	async update(req, res){
		const libros = req.body;
		const [result] = await pool.query (`UPDATE libros SET nombre=(?), autor=(?),
			categoria=(?), fechaPublicacion=(?), isbn=(?) WHERE id=(?)`, [libros.nombre, libros.autor,
				libros.categoria, libros.fechaPublicacion, libros.isbn]);
		res.json ({"Registros actualizados": result.changedRows});
	}

}
export const libros = new LibrosController();


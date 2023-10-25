 import { Router } from 'express';
 import { libros } from './controller.js'; //importamos el objeto que creamos en controller

 export const router = Router() //instanciamos para cargar nuestras rutas

 router.get('/libros', libros.getAll);
 router.get('/libro', libros.getOne);
 router.post('/libros', libros.agregarLibro); //permitir cargar con datos la solicitud http, funcion POst
 router.delete('/libros', libros.delete);
 router.put('/libros', libros.update);
 router.delete('/libro', libros.eliminarPorISBN);
 
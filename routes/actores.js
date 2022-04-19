const { Router } = require('express');
const router = Router();
const { pool } = require('../DB/config');
const Joi = require('Joi');
const validator= require ("express-joi-validation").createValidator({});



router.get('/actor', (req, res) => {
    res.send("<h1>API Academia</h1>")
})

router.get('/login', async(req,res)=>{
    let cliente = await pool.connect();
    const {
        user,
        password
    } = req.query
    try{
        let result = await cliente.query(`SELECT * FROM actores WHERE contrasena = $1 AND correo= $2`,[password,user])
        console.log(result)
        res.json(result.rows)
    }catch(err){
        console.log({err})
        res.status(500).json({error: "Internal error server"})
    }finally{
        cliente.release(true);
    }
})

const bodySchema = Joi.object({
    documento: Joi.string().max(20).required(),
    tipo_documento: Joi.string().max(3), 
    nombres: Joi.string().max(255).required(),
    apellidos: Joi.string().max(255).required(),
    contrasena: Joi.string().max(80),
    correo: Joi.string().max(100),
    telefono_celular: Joi.string().max(30),
    numero_expediente: Joi.string().max(255),
    genero: Joi.string().max(6), 
    fecha_nacimiento: Joi.date().greater('now'), 
    estado_actor_id: Joi.number(),
    institucion_id: Joi.number().integer().required(), 
    tipo_actor_id: Joi.number().integer(), 
    fecha_creacion: Joi.date().greater('now'), 
    fecha_actualizacion: Joi.date().greater('now'), 
  })

  router.post('/actor', validator.body(bodySchema), async (req, res) => {
    try {
      const {
        documento,
        tipo_documento,
        nombres,
        apellidos,
        contrasena,
        correo,
        telefono_celular,
        numero_expediente,
        genero,
        fecha_nacimiento,
        estado_actor_id,
        institucion_id,
        tipo_actor_id,
        fecha_creacion,
        fecha_actualizacion
      } = req.body
      const client = await pool.connect()
      const response = await client.query(
        `INSERT INTO actores(documento, tipo_documento, nombres, apellidos, contrasena, correo, telefono_celular, numero_expediente, genero, fecha_nacimiento, estado_actor_id, institucion_id, tipo_actor_id, fecha_creacion,fecha_actualizacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
        [
          documento,
          tipo_documento,
          nombres,
          apellidos,
          contrasena,
          correo,
          telefono_celular,
          numero_expediente,
          genero,
          fecha_nacimiento,
          estado_actor_id,
          institucion_id,
          tipo_actor_id,
          fecha_creacion,
          fecha_actualizacion
        ]
      )
      if (response.rowCount > 0) {
        res.json({
          id: response.rows[0].id,
          documento: documento,
          tipo_documento: tipo_documento,
          nombres: nombres,
          apellidos: apellidos,
          contrasena: contrasena,
          correo: correo,
          telefono_celular: telefono_celular,
          numero_expediente: numero_expediente,
          genero: genero,
          fecha_nacimiento: fecha_nacimiento,
          estado_actor_id: estado_actor_id,
          institucion_id: institucion_id,
          tipo_actor_id: tipo_actor_id,
          fecha_creacion: fecha_creacion,
          fecha_actualizacion: fecha_actualizacion
        })
      } else {
        res.json({})
      }
    } catch (e) {
      console.log(e)
      res
        .status(500)
        .json({ errorCode: e.errno, message: 'Error en el servidor' })
    }
  })



module.exports = router
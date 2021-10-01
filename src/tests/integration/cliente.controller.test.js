import request from 'supertest'
import mongoose from 'mongoose'
import StatusCode from 'http-status-codes'
import Cliente from '../../models/cliente.model.js'
import app from '../../app.js'
import { CLIENTE_ACTUALIZADO, CLIENTE_REGISTRADO, NOMBRE_REQUERIDO, SUCCESS } from '../../config/mensajes.js'

const url = '/api/v1/clientes/'

describe('${url}', () => {
  let cliente1
  let cliente2

  beforeEach(async () => {          
      await Cliente.deleteMany({})
      cliente1 = await Cliente.create({ nombre: 'Cliente 1'})  
      cliente2 = await Cliente.create({ nombre: 'Cliente 2'})  
  })

    it("debe devolver todos los clientes", async () => {        
      const res = await request(app).get(url)
        
      expect(res.statusCode).toBe(StatusCode.OK)
      expect(res.body.status).toBe(SUCCESS)
      expect(res.body.results).toBeDefined()            
      expect(res.body.results).toBe(2)                        
    })  

    it("debe devolver un cliente", async() => {
      const res = await request(app).get(url + cliente1._id)

      expect(res.statusCode).toBe(StatusCode.OK)
      expect(res.body.status).toBe(SUCCESS)           
      expect(res.body.data.cliente.nombre).toBe(cliente1.nombre)        
      expect(res.body.data.cliente._id).toBeDefined()         
    })

    it("debe devolver un error 404 si el id está mal formado", async() => {
      const id = mongoose.Types.ObjectId()
      const res = await request(app).get(url + id)

      expect(res.statusCode).toBe(StatusCode.NOT_FOUND)
    })

    it("debe devolver un error 400 si no existe el cliente", async() => {
      const res = await request(app).get(url + '1')

      expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)    
    })  

    it("debe devolver un cliente", async () => {
      const cliente = {nombre: 'Cliente 3'}
      const res = await request(app).post(url).send(cliente)

      expect(res.statusCode).toBe(StatusCode.CREATED)
      expect(res.body.status).toBe(SUCCESS)
      expect(res.body.message).toBe(CLIENTE_REGISTRADO)
      expect(res.body.data.cliente.nombre).toBe(cliente.nombre)   
      expect(res.body.data.cliente._id).toBeDefined()        
    })

    it("debe devolver un error 400 cuando no se facilita el nombre del cliente", async () => {
      const cliente = {nombre: ''}
      const res = await request(app).post(url).send(cliente)

      expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)      
      expect(res.body.success).toBeFalsy()
      expect(res.body.error).toBe(NOMBRE_REQUERIDO)
    })

    it("debe devolver un error 400 si el cliente ya existe", async () => {        
      const cliente = {nombre: 'Cliente 1'}
      await request(app).post(url).send(cliente)
      const res = await request(app).post(url).send(cliente)

      expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)      
      expect(res.body.success).toBeFalsy()
    })

    it("debe contar los clientes registrados en la base de datos", async() => {
      const res = await request(app).get(url + '/count')

      expect(res.statusCode).toBe(StatusCode.OK)
      expect(res.body.data.count).toBe(2)
    })
  
    it("debe actualizar un cliente con éxito", async() => {
      const cliente = { nombre: "Cliente 999" }
      const res = await request(app).put(url + cliente1._id).send(cliente)

      expect(res.statusCode).toBe(StatusCode.OK)
      expect(res.body.status).toBe(SUCCESS)   
      expect(res.body.message).toBe(CLIENTE_ACTUALIZADO)
      expect(res.body.data.cliente._id).toBeDefined()
      expect(res.body.data.cliente.nombre).toBe(cliente.nombre)    
    })  

    it("debe dar un error 400 si actualizamos un cliente sin nombre", async() => {
      const cliente = { nombre: "" }
      const res = await request(app).put(url + cliente1._id).send(cliente)

      expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)
      expect(res.body.success).toBeFalsy()    
      expect(res.body.error).toBe(NOMBRE_REQUERIDO)        
    })  

  
  
  
  })
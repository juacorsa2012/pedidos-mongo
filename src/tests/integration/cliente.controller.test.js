import request from 'supertest'
import mongoose from 'mongoose'
import StatusCode from 'http-status-codes'
import Cliente from '../../models/cliente.model.js'
import app from '../../app.js'
import { CLIENTE_ACTUALIZADO, CLIENTE_REGISTRADO, NOMBRE_REQUERIDO, SUCCESS } from '../../config/mensajes.js'

const url = '/api/v1/clientes/'

describe('/api/v1/clientes', () => {
  describe('GET /', () => {
    beforeAll(async () => {          
      await Cliente.deleteMany({})
      await Cliente.create({ nombre: 'Cliente 1'})  
    })

    it("debe devolver todos los clientes", async () => {        
      const res = await request(app).get(url)
        
      expect(res.statusCode).toBe(StatusCode.OK)
      expect(res.body.status).toBe(SUCCESS)
      expect(res.body.results).toBeDefined()            
      expect(res.body.results).toBe(1)          
      expect(res.body.data.clientes[0]['nombre']).toBe('Cliente 1')          
    })  
  })
   
  describe('GET /:id', () => {
      let cliente

      beforeAll(async () => {
        await Cliente.deleteMany({})
        cliente = await Cliente.create({ nombre: 'Cliente 1'})  
      })

      it("debe devolver un cliente", async() => {
        const res = await request(app).get(url + cliente._id)

        expect(res.statusCode).toBe(StatusCode.OK)
        expect(res.body.status).toBe(SUCCESS)           
        expect(res.body.data.cliente.nombre).toBe(cliente.nombre)        
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
  })   
  
  describe('GET /:id', () => {
      let cliente = { nombre: "Cliente 1" }

      beforeAll(async () => {
        await Cliente.deleteMany({})
      })

      it("debe devolver un cliente", async () => {
        const res = await request(app).post(url).send(cliente)

        expect(res.statusCode).toBe(StatusCode.CREATED)
        expect(res.body.status).toBe(SUCCESS)
        expect(res.body.message).toBe(CLIENTE_REGISTRADO)
        expect(res.body.data.cliente.nombre).toBe(cliente.nombre)   
        expect(res.body.data.cliente._id).toBeDefined()        
      })

      it("debe devolver un error 400 cuando no se facilita el nombre del cliente", async () => {
        cliente.nombre = ""
        const res = await request(app).post(url).send(cliente)

        expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(NOMBRE_REQUERIDO)
      })

      it("debe devolver un error 400 si el cliente ya existe", async () => {        
        await request(app).post(url).send(cliente)
        const res = await request(app).post(url).send(cliente)

        expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
      })
  })

  describe('GET /count', () => {
    beforeAll(async () => {
      await Cliente.deleteMany({})
      await Cliente.create({ nombre: 'Cliente 1' })  
      await Cliente.create({ nombre: 'Cliente 2' })  
    })

    it("debe contar los clientes registrados en la base de datos", async() => {
      const res = await request(app).get(url + '/count')

      expect(res.statusCode).toBe(StatusCode.OK)
      expect(res.body.data.count).toBe(2)
    })
  })
  
  describe('PUT /:id', () => {
    let idCliente1
    let idCliente2
    let cliente

    beforeAll(async () => {
      await Cliente.deleteMany({})
      const cliente1 = await Cliente.create({ nombre: 'Cliente 1' })  
      const cliente2 = await Cliente.create({ nombre: 'Cliente 2' })  
      idCliente1 = cliente1._id
      idCliente2 = cliente2._id
    })

    it("debe actualizar un cliente con éxito", async() => {
      cliente = { nombre: "Cliente 1" }
      const res = await request(app).put(url + idCliente1).send(cliente)

      expect(res.statusCode).toBe(StatusCode.OK)
      expect(res.body.status).toBe(SUCCESS)   
      expect(res.body.message).toBe(CLIENTE_ACTUALIZADO)
      expect(res.body.data.cliente._id).toBeDefined()
      expect(res.body.data.cliente.nombre).toBe(cliente.nombre)    
    })  

    it("debe dar un error 400 si actualizamos un cliente sin nombre", async() => {
      cliente = { nombre: "" }
      const res = await request(app).put(url + idCliente1).send(cliente)

      expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)
      expect(res.body.success).toBeFalsy()    
      expect(res.body.error).toBe(NOMBRE_REQUERIDO)        
    })  

  }) 
})
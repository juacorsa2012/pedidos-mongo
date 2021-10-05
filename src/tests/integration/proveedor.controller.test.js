import request from 'supertest'
import mongoose from 'mongoose'
import StatusCode from 'http-status-codes'
import Proveedor from '../../models/proveedor.model.js'
import app from '../../app.js'
import { NOMBRE_REQUERIDO, PROVEEDOR_ACTUALIZADO, PROVEEDOR_REGISTRADO, SUCCESS } from '../../config/mensajes.js'

const url = '/api/v1/proveedores/'

describe('${url}', () => {
  let proveedor1 
  let proveedor2

  beforeEach(async () => {          
    await Proveedor.deleteMany({})
    proveedor1 = await Proveedor.create({ nombre: 'Proveedor 1'})  
    proveedor2 = await Proveedor.create({ nombre: 'Proveedor 2'})  
  })

  it("GET - debe devolver todos los proveedores", async () => {        
    const res = await request(app).get(url)      
    expect(res.statusCode).toBe(StatusCode.OK)
    expect(res.body.status).toBe(SUCCESS)
    expect(res.body.results).toBeDefined()            
    expect(res.body.results).toBe(2)          
    expect(res.body.data.proveedores[0]['nombre']).toBe('Proveedor 1')          
  })
  
  it("GET - debe devolver un proveedor", async() => {
    const res = await request(app).get(url + proveedor1._id)
    expect(res.statusCode).toBe(StatusCode.OK)
    expect(res.body.status).toBe(SUCCESS)           
    expect(res.body.data.proveedor.nombre).toBe(proveedor1.nombre)        
    expect(res.body.data.proveedor._id).toBeDefined()         
  })

  it("GET - debe devolver un error 404 si el id está mal formado", async() => {
    const id = mongoose.Types.ObjectId()
    const res = await request(app).get(url + id)
    expect(res.statusCode).toBe(StatusCode.NOT_FOUND)
  })

  it("GET - debe devolver un error 400 si no existe el proveedor", async() => {
    const res = await request(app).get(url + '1')
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)    
  })  

  it("POST - debe devolver un proveedor", async () => {
    const proveedor = { nombre: "Proveedor" }
    const res = await request(app).post(url).send(proveedor)
    expect(res.statusCode).toBe(StatusCode.CREATED)
    expect(res.body.status).toBe(SUCCESS)
    expect(res.body.message).toBe(PROVEEDOR_REGISTRADO)
    expect(res.body.data.proveedor.nombre).toBe(proveedor.nombre)   
    expect(res.body.data.proveedor._id).toBeDefined()        
  })

  it("POST - debe devolver un error 404 si duplicamos el nombre de un proveedor", async () => {
    const proveedor = { nombre: "Proveedor 1" }
    const res = await request(app).post(url).send(proveedor)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)
    expect(res.body.error).toBeDefined()
    expect(res.body.success).toBeFalsy()        
  })

  it("POST - debe devolver un error 400 cuando no se facilita el nombre del proveedor", async () => {
    const proveedor = { nombre: "" }
    const res = await request(app).post(url).send(proveedor)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)      
    expect(res.body.success).toBeFalsy()
    expect(res.body.error).toBe(NOMBRE_REQUERIDO)
  })

  it("POST - debe devolver un error 400 al registrar un proveedor existente", async () => {        
    const proveedor = { nombre: "Proveedor 1" }
    const res = await request(app).post(url).send(proveedor)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)      
    expect(res.body.success).toBeFalsy()
  })

  it("GET - debe contar los proveedores registrados en la base de datos", async() => {
    const res = await request(app).get(url + '/count')
    expect(res.statusCode).toBe(StatusCode.OK)
    expect(res.body.data.count).toBe(2)
  })

  it("PUT - debe actualizar un proveedor con éxito", async() => {
    const proveedor = { nombre: "Proveedor 999" }
    const res = await request(app).put(url + proveedor2._id).send(proveedor)
    expect(res.statusCode).toBe(StatusCode.OK)
    expect(res.body.status).toBe(SUCCESS)   
    expect(res.body.message).toBe(PROVEEDOR_ACTUALIZADO)
    expect(res.body.data.proveedor._id).toBeDefined()
    expect(res.body.data.proveedor.nombre).toBe(proveedor.nombre)
  })  

  it("PUT - debe dar un error 400 si actualizamos un proveedor sin nombre", async() => {
    const proveedor = { nombre: "" }
    const res = await request(app).put(url + proveedor1._id).send(proveedor)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)
    expect(res.body.success).toBeFalsy()    
    expect(res.body.error).toBe(NOMBRE_REQUERIDO)        
  })  
})
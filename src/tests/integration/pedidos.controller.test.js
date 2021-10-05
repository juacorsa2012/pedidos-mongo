import request from 'supertest'
import mongoose from 'mongoose'
import StatusCode from 'http-status-codes'
import Proveedor from '../../models/proveedor.model.js'
import Pedido from '../../models/pedido.model.js'
import Cliente from '../../models/cliente.model.js'
import app from '../../app.js'
import { CLIENTE_REQUERIDO, PEDIDO_ACTUALIZADO, PEDIDO_ELIMINADO, PEDIDO_NO_ENCONTRADO, PEDIDO_REGISTRADO, PRODUCTO_REQUERIDO, 
         PROVEEDOR_REQUERIDO, SUCCESS, UNIDADES_REQUERIDO } from '../../config/mensajes.js'

const url = '/api/v1/pedidos/'

describe(`${url}`, () => {
  let proveedor  
  let cliente
  let pedido

  beforeEach(async () => {          
    await Proveedor.deleteMany({})
    await Cliente.deleteMany({})
    await Pedido.deleteMany({})

    proveedor = await Proveedor.create({ nombre: 'Proveedor 1'})  
    cliente   = await Cliente.create({ nombre: 'Cliente 1'})  
    pedido = {
      "producto"  : "Producto 1",
      "unidades"  : 4,
      "referencia": "referencia 1",
      "oferta"    :  "OF 6",
      "cliente"   : cliente._id,
      "proveedor" : proveedor._id
    }

    pedido = await Pedido.create(pedido)  
  })

  it("GET - debe devolver todos los pedidos", async () => {        
    const res = await request(app).get(url)        
    expect(res.statusCode).toBe(StatusCode.OK)
    expect(res.body.status).toBe(SUCCESS)              
    expect(res.body.meta.results).toBe(1)
    expect(res.body.meta.page).toBeDefined()
    expect(res.body.meta.limit).toBeDefined()
    expect(res.body.data.pedidos).toBeDefined()

  })  

  it("GET - debe devolver un pedido", async() => {
    const res = await request(app).get(url + pedido._id)
    expect(res.statusCode).toBe(StatusCode.OK)
    expect(res.body.status).toBe(SUCCESS)           
    expect(res.body.data.pedido.producto).toBe(pedido.producto)
    expect(res.body.data.pedido.unidades).toBe(pedido.unidades)
    expect(res.body.data.pedido.referencia).toBe(pedido.referencia)
    expect(res.body.data.pedido.oferta).toBe(pedido.oferta)
    expect(res.body.data.pedido.proveedor.nombre).toBe(proveedor.nombre)
  })

  it("GET - debe devolver un error 404 si el id está mal formado", async() => {
    const id = mongoose.Types.ObjectId()
    const res = await request(app).get(url + id)
    expect(res.statusCode).toBe(StatusCode.NOT_FOUND)
  })

  it("GET - debe devolver un error 400 si no existe el pedido", async() => {
    const res = await request(app).get(url + '1')
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)    
  })  

  it("POST - debe devolver un pedido", async () => {
    const pedido = {
      "producto"  : "Producto 2",
      "unidades"  : 4,
      "referencia": "referencia 2",
      "oferta"    :  "OF 90",
      "cliente"   : cliente._id,
      "proveedor" : proveedor._id
    }

    const res = await request(app).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCode.CREATED)
    expect(res.body.status).toBe(SUCCESS)
    expect(res.body.message).toBe(PEDIDO_REGISTRADO)
    expect(res.body.data.pedido.producto).toBe(pedido.producto)
    expect(res.body.data.pedido.unidades).toBe(pedido.unidades)
    expect(res.body.data.pedido.referencia).toBe(pedido.referencia)
    expect(res.body.data.pedido.oferta).toBe(pedido.oferta)    
  })

  it("POST - debe devolver un error 400 cuando no se facilita el producto al registrar un pedido", async () => {
    const pedido = {
      "producto"  : "",
      "unidades"  : 4,
      "referencia": "referencia 2",
      "oferta"    :  "OF 90",
      "cliente"   : cliente._id,
      "proveedor" : proveedor._id
    }
    
    const res = await request(app).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)      
    expect(res.body.success).toBeFalsy()
    expect(res.body.error).toBe(PRODUCTO_REQUERIDO)
  })

  it("POST - debe devolver un error 400 cuando no se facilitan las unidades al registrar un pedido", async () => {
    const pedido = {
      "producto"  : "Producto 5",      
      "referencia": "referencia 2",
      "oferta"    :  "90",
      "cliente"   : cliente._id,
      "proveedor" : proveedor._id
    }
    
    const res = await request(app).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)      
    expect(res.body.success).toBeFalsy()
    expect(res.body.error).toBe(UNIDADES_REQUERIDO)
  })

  it("POST - debe devolver un error 400 cuando no se facilita el cliente al registrar un pedido", async () => {
    const pedido = {
      "producto"  : "Producto 5",      
      "unidades"  : 90,
      "referencia": "referencia 2",
      "oferta"    :  "OF 90",      
      "proveedor" : proveedor._id
    }
    
    const res = await request(app).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)      
    expect(res.body.success).toBeFalsy()
    expect(res.body.error).toBe(CLIENTE_REQUERIDO)
  })

  it("POST - debe devolver un error 400 cuando no se facilita el proveedor al registrar un pedido", async () => {
    const pedido = {
      "producto"  : "Producto 5",      
      "unidades"  : 90,
      "referencia": "referencia 2",
      "oferta"    :  "OF 90",      
      "cliente"   : cliente._id
    }
    
    const res = await request(app).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)      
    expect(res.body.success).toBeFalsy()
    expect(res.body.error).toBe(PROVEEDOR_REQUERIDO)
  })

  it("PUT - debe actualizar un pedido con éxito", async () => {
    const pedido_PUT = {
      "producto"  : "Producto PUTd",      
      "unidades"  : 90,
      "referencia": "referencia 2",
      "oferta"    :  "OF 90",      
      "cliente"   : cliente._id,
      "proveedor" : proveedor._id
    }      

    const res = await request(app).put(url + pedido._id).send(pedido_PUT)
    expect(res.statusCode).toBe(StatusCode.OK)  
    expect(res.body.status).toBe(SUCCESS)
    expect(res.body.message).toBe(PEDIDO_ACTUALIZADO)
    expect(res.body.data.pedido.producto).toBe(pedido_PUT.producto)
    expect(res.body.data.pedido.unidades).toBe(pedido_PUT.unidades)
    expect(res.body.data.pedido.referencia).toBe(pedido_PUT.referencia)
    expect(res.body.data.pedido.oferta).toBe(pedido_PUT.oferta)
    expect(res.body.data.pedido.cliente).toBeDefined()
    expect(res.body.data.pedido.proveedor).toBeDefined()
  })

  it("PUT - debe devolver un error 404 si el pedido no existe", async () => {
    const id = mongoose.Types.ObjectId()
    const pedido_PUT = {
      "producto"  : "Producto PUTd",      
      "unidades"  : 90,
      "referencia": "referencia 2",
      "oferta"    :  "OF 90",      
      "cliente"   : cliente._id,
      "proveedor" : proveedor._id
    }  

    const res = await request(app).put(url + id).send(pedido_PUT)
    expect(res.statusCode).toBe(StatusCode.NOT_FOUND)  
    expect(res.body.error).toBe(PEDIDO_NO_ENCONTRADO)
    expect(res.body.success).toBeFalsy()
  })

  it("PUT - debe devolver un error 400 si se intenta actualizar un pedido sin cliente", async () => {  
    const pedido_PUT = {         
      "producto"  : "jjkfdf dfdkjfkd",
      "unidades"  : 90,
      "referencia": "referencia 2",
      "oferta"    :  "OF 90",            
      "proveedor" : proveedor._id
    }  

    const res = await request(app).put(url + pedido._id).send(pedido_PUT)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)
    expect(res.body.error).toBe(CLIENTE_REQUERIDO)
    expect(res.body.success).toBeFalsy()
  })

  it("PUT - debe devolver un error 400 si se intenta actualizar un pedido sin proveedor", async () => {  
    const pedido_PUT = {         
      "producto"  : "jjkfdf dfdkjfkd",
      "unidades"  : 90,
      "referencia": "referencia 2",
      "oferta"    :  "OF 90",            
      "cliente"   : cliente._id
    }  

    const res = await request(app).put(url + pedido._id).send(pedido_PUT)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)
    expect(res.body.error).toBe(PROVEEDOR_REQUERIDO)
    expect(res.body.success).toBeFalsy()
  })

  it("PUT - debe devolver un error 400 si se intenta actualizar un pedido sin producto", async () => {  
    const pedido_PUT = {         
      "producto"  : "",
      "unidades"  : 90,
      "referencia": "referencia 2",
      "oferta"    :  "OF 90",            
      "cliente"   : cliente._id,
      "proveedor" : proveedor._id
    }  

    const res = await request(app).put(url + pedido._id).send(pedido_PUT)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)
    expect(res.body.error).toBe(PRODUCTO_REQUERIDO)
    expect(res.body.success).toBeFalsy()
  })

  it("PUT - debe devolver un error 400 si se intenta actualizar un pedido sin unidades", async () => {  
    const pedido_PUT = {         
      "producto"  : "producto",  
      "unidades"  : "",
      "referencia": "referencia 2",
      "oferta"    :  "OF 90",            
      "cliente"   : cliente._id,
      "proveedor" : proveedor._id
    }  

    const res = await request(app).put(url + pedido._id).send(pedido_PUT)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)
    expect(res.body.error).toBe(UNIDADES_REQUERIDO)
    expect(res.body.success).toBeFalsy()
  })

  it("DELETE - debe eliminar un pedido con éxito", async () => {
    const res = await request(app).delete(url + pedido._id)
    expect(res.statusCode).toBe(StatusCode.OK)  
    expect(res.body.status).toBe(SUCCESS)
    expect(res.body.message).toBe(PEDIDO_ELIMINADO)    
    expect(res.body.data.pedido._id).toBeDefined()
    expect(res.body.data.pedido.cliente).toBeDefined()
    expect(res.body.data.pedido.proveedor).toBeDefined()
    expect(res.body.data.pedido.producto).toBeDefined()
    expect(res.body.data.pedido.unidades).toBeDefined()
    expect(res.body.data.pedido.referencia).toBeDefined()
    expect(res.body.data.pedido.oferta).toBeDefined()
    expect(res.body.data.pedido.estado).toBeDefined()
  })

  it("DELETE - debe devolver un error 404 si el pedido no existe", async () => {
    const id = mongoose.Types.ObjectId()
    const res = await request(app).delete(url + id)
    expect(res.statusCode).toBe(StatusCode.NOT_FOUND)  
    expect(res.body.error).toBe(PEDIDO_NO_ENCONTRADO)
    expect(res.body.success).toBeFalsy()
  })
})
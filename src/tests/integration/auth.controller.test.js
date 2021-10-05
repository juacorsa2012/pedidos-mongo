import request from 'supertest'
import mongoose from 'mongoose'
import StatusCode from 'http-status-codes'
import Usuario from '../../models/usuario.model.js'
import app from '../../app.js'
import { CLIENTE_REQUERIDO, EMAIL_NO_VALIDO, EMAIL_REQUERIDO, NOMBRE_REQUERIDO, PASSWORD_CORTO, PASSWORD_REQUERIDO, PEDIDO_ACTUALIZADO, PEDIDO_ELIMINADO, PEDIDO_NO_ENCONTRADO, PEDIDO_REGISTRADO, PRODUCTO_REQUERIDO, 
         PROVEEDOR_REQUERIDO, SUCCESS, UNIDADES_REQUERIDO } from '../../config/mensajes.js'

const url = '/api/v1/usuarios/'

describe(`${url}`, () => { 
  beforeEach(async () => {          
    await Usuario.deleteMany({})   
  })

  it("POST - debe registrar un nuevo usuario", async () => {    
    const usuario = {
      "nombre"   : "Usuario 1",
      "password" : "Password",
      "email"    : "email@test.com",
      "rol"      : "user"
    }

    const res = await request(app).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCode.CREATED)
    expect(res.body.status).toBe(SUCCESS)  
    expect(res.body.token).toBeDefined()
  })

  it("POST - debe devolver un error 400 si intentamos registrar un usuario sin nombre", async () => {    
    const usuario = {
      "nombre"   : "",
      "password" : "Password",
      "email"    : "email@test.com",
      "rol"      : "user"
    }

    const res = await request(app).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)
    expect(res.body.success).toBeFalsy()
    expect(res.body.error).toBe(NOMBRE_REQUERIDO)
  })

  it("POST - debe devolver un error 400 si intentamos registrar un usuario sin password", async () => {    
    const usuario = {
      "nombre"   : "Usuario 1",
      "password" : "",
      "email"    : "email@test.com",
      "rol"      : "user"
    }

    const res = await request(app).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)
    expect(res.body.success).toBeFalsy()
    expect(res.body.error).toBe(PASSWORD_REQUERIDO)
  })
  
  it("POST - debe devolver un error 400 si intentamos registrar un usuario con un password inferior a 8 caracteres", async () => {    
    const usuario = {
      "nombre"   : "Usuario",
      "password" : "1234",
      "email"    : "email@test.com",
      "rol"      : "user"
    }

    const res = await request(app).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)
    expect(res.body.success).toBeFalsy()
    expect(res.body.error).toBe(PASSWORD_CORTO)
  })

  it("POST - debe devolver un error 400 si intentamos registrar un usuario con un email mal formado", async () => {    
    const usuario = {
      "nombre"   : "Usuario",
      "password" : "Password",
      "email"    : "email@test",
      "rol"      : "user"
    }

    const res = await request(app).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)
    expect(res.body.success).toBeFalsy()
    expect(res.body.error).toBe(EMAIL_NO_VALIDO)
  })

  it("POST - debe devolver un error 400 si intentamos registrar un usuario sin email", async () => {    
    const usuario = {
      "nombre"   : "Usuario",
      "password" : "Password",
      "email"    : "",
      "rol"      : "user"
    }

    const res = await request(app).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)
    expect(res.body.success).toBeFalsy()
    expect(res.body.error).toBe(EMAIL_REQUERIDO)
  })

  it("POST - debe devolver un error 400 si intentamos registrar un usuario con un rol distinto de user o admin", async () => {    
    const usuario = {
      "nombre"   : "Usuario",
      "password" : "Password",
      "email"    : "email@test.com",
      "rol"      : "rol"
    }

    const res = await request(app).post(url + 'registro').send(usuario)
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST)
    expect(res.body.success).toBeFalsy()    
  })



})

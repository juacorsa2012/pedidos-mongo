import express from 'express'
import * as controller from '../controllers/clientes.controller.js'

const router = express.Router()

router.get('/count', controller.contarClientes)
router.get('/', controller.obtenerClientes)
router.get('/:id', controller.obtenerCliente)
router.post('', controller.registrarCliente)
router.put('/:id', controller.actualizarCliente)

export default router


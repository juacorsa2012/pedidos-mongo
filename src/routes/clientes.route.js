import express from 'express'
import { actualizarCliente, contarClientes, obtenerCliente, obtenerClientes, 
         obtenerPedidosCliente, registrarCliente, } from '../controllers/clientes.controller.js'
import { checkAuth, checkRol } from '../controllers/auth.controller.js'

const router = express.Router()

router.get('/count', contarClientes)
router.get('/',  obtenerClientes)
router.get('/:id', obtenerCliente)
router.get('/:id/pedidos', obtenerPedidosCliente)
router.post('', registrarCliente)
router.put('/:id', actualizarCliente)

export default router


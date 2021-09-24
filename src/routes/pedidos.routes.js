import express from 'express'
import { actualizarPedido, eliminarPedido, obtenerPedido, obtenerPedidos, 
         registrarPedido }  from '../controllers/pedidos.controller.js'

const router = express.Router()

router.get('', obtenerPedidos)
router.get('/:id', obtenerPedido)
router.post('', registrarPedido)
router.put('/:id', actualizarPedido)
router.delete('/:id', eliminarPedido)

export default router


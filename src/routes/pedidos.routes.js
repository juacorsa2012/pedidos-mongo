import express from 'express'
import * as controller from '../controllers/pedidos.controller.js'

const router = express.Router()

router.get('', controller.obtenerPedidos)
router.get('/:id', controller.obtenerPedido)
router.post('', controller.registrarPedido)
router.put('/:id', controller.actualizarPedido)
router.delete('/:id', controller.eliminarPedido)

export default router


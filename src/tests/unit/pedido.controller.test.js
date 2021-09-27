import { actualizarPedido, eliminarPedido, obtenerPedido, 
         obtenerPedidos, registrarPedido } from '../../controllers/pedidos.controller.js'

describe("PedidoController", () => {    
  it("debería existir una función llamada obtenerPedido", () => {
    expect(typeof obtenerPedido).toBe("function")
  })

  it("debería existir una función llamada obtenerPedidos", () => {
    expect(typeof obtenerPedidos).toBe("function")
  })

  it("debería existir una función llamada registrarPedido", () => {
    expect(typeof registrarPedido).toBe("function")
  })

  it("debería existir una función llamada actualizarPedido", () => {
    expect(typeof actualizarPedido).toBe("function")
  })

  it("debería existir una función llamada eliminarPedido", () => {
    expect(typeof eliminarPedido).toBe("function")
  })
})
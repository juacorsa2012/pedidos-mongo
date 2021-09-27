import { actualizarCliente, obtenerCliente, obtenerClientes, 
         obtenerPedidosCliente, 
         registrarCliente } from '../../controllers/clientes.controller.js'

describe("Test ClienteController", () => {    
  it("debería existir una función llamada obtenerCliente", () => {
    expect(typeof obtenerCliente).toBe("function")
  })

  it("debería existir una función llamada obtenerClientes", () => {
    expect(typeof obtenerClientes).toBe("function")
  })

  it("debería existir una función llamada registrarCliente", () => {
    expect(typeof registrarCliente).toBe("function")
  })

  it("debería existir una función llamada actualizarCliente", () => {
    expect(typeof actualizarCliente).toBe("function")
  })

  it("debería existir una función llamada obtenerPedidosCliente", () => {
    expect(typeof obtenerPedidosCliente).toBe("function")
  })
})
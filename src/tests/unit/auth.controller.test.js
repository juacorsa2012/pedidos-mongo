import { checkAuth, checkRol, login, registro } from '../../controllers/auth.controller.js'

describe("AuthController", () => {    
  it("debería existir una función llamada registro", () => {
    expect(typeof registro).toBe("function")
  })

  it("debería existir una función llamada login", () => {
    expect(typeof login).toBe("function")
  })

  it("debería existir una función llamada checkAuth", () => {
    expect(typeof checkAuth).toBe("function")
  })

  it("debería existir una función llamada checkRol", () => {
    expect(typeof checkRol).toBe("function")
  })
})
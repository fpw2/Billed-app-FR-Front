/**
 * @jest-environment jsdom
 */

import user from "@testing-library/user-event"
import { screen, fireEvent, userEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import { ROUTES } from "../constants/routes.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then i add a proof in the correct format", () => { // justificatif : proof
      const html = NewBillUI()
      document.body.innerHTML = html // je simule mon affichage rendu html de NewBillUI
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock }) // je remplace le localStorage de window avec mon mock (localeStorageMock)
      window.localStorage.setItem("user", JSON.stringify({email: "aaa@gmail.com"})) // ligne 27 NewBill.js
      const container = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})
      const handleChangeFile = jest.fn(e => container.handleChangeFile(e)) // simulation event
      const input = screen.getByTestId('file') // mon input ou je mets mon fichier
      const file = new File(['img'], 'image.png', {type: 'image/png'}) // test 
      input.addEventListener('change', handleChangeFile) // event
      user.upload(input, file) // librairie pour simuler le téléchargement de mon fichier file

      expect(handleChangeFile).toBeCalled()
      expect(input.files[0]).toStrictEqual(file)
      expect(input.files.item(0)).toStrictEqual(file)
      expect(input.files).toHaveLength(1)
      // expect(input.checkValidity()).toBe(true)
    })

    test("Then i add a proof in the wrong format", () => {
      const html = NewBillUI()
      document.body.innerHTML = html // je simule mon affichage rendu html de NewBillUI
     
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({type: "aaa@gmail"}))
      const container = new NewBill({document, onNavigate: null, store: mockStore, localStorage: window.localStorage})
      const handleChangeFile = jest.fn(e => container.handleChangeFile(e))
      const input = screen.getByTestId('file')
      const file = new File(['img'], 'image.txt', {type: 'text/plain'})
      input.addEventListener('change', handleChangeFile)
      user.upload(input, file)

      expect(handleChangeFile).toBeCalled()
      expect(input.files[0]).toStrictEqual(file)
      expect(input.files.item(0)).toStrictEqual(file)
      expect(input.files).toHaveLength(1)
      expect(input.checkValidity()).toBe(false)
    })

    test("Then i submit a new bill", () => {
      const html = NewBillUI()
      document.body.innerHTML = html // je simule mon affichage rendu html de NewBillUI
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({type: "aaa@gmail"}))
      const container = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})
      const handleSubmit = jest.fn(e => container.handleSubmit(e))
      const form = screen.getByTestId('form-new-bill')
      form.addEventListener('submit', handleSubmit)
      fireEvent.submit(form)

      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})

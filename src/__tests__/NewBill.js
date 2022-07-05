/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then i add a proof in the correct format", () => { // justificatif : proof
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const newBill = new NewBill({document, html, store: localStorageMock, localStorage: null})

      const file = screen.getByTestId('file')
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      file.addEventListener('change', handleChangeFile)
      // fireEvent pour les événements change
      fireEvent.change(file, {
        target: {
          files: [new File('chucknorris.png',{type:'image/png'})]
        }
      })
9
      expect(file.name).toBe(".png")
      expect(handleChangeFile).toBeCalled

      // // Get Inputs HTML Element
      // const expenseType = screen.getAllByTestId("expense-type")
      // fireEvent.change(expenseType, {target: {value: expenseData.type}})
      // expect(expenseType).toIn



    })

    test("Then i add a proof in the wrong format", () => {
    })
  })
})

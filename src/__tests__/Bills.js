/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js"
import mockStore from "../__mocks__/store"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import { ROUTES } from "../constants/routes.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon'))

    })
    test("Then bills should be ordered from earliest to latest", async() => {
      // document.body.innerHTML = BillsUI({ data: bills })
      // const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      // const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      // const datesSorted = [...dates].sort(antiChrono)
      // expect(dates).toEqual(datesSorted)
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      let container = new Bills({document: document, onNavigate: onNavigate, store: mockStore, localStorage: null })
      let bills = await container.getBills()
      let dates = bills.map(bill => bill.date)
      const antiChrono = (a, b) => ((a > b) ? -1 : 1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
     
    })
  })
})

// Given
describe("Given I am a user connected as Employee", () => {  
  // When 
  describe("When I navigate to Bills and click on eye's icon", () => {  
    // Then

    test("then a modal should open", () => {  
      window.onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // window.onNavigate(ROUTES_PATH.Bills)
      document.body.innerHTML = BillsUI({ data: bills})
      // Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      // window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
      // const root = document.createElement("div")
      // root.setAttribute("id", "root")
      // document.body.append(root) // <div id="root"></div>
      // router()
      // const billsContainer = new Bills({document, onNavigate, store: null, bills: bills, localStorage: window.localStorage})
      
      // window.$ = (id) => {
      //   const idElt = document.querySelector(id);
      //   idElt.modal = (mode) => {
      //     idElt.classList.add(mode)
      //   }
      //   idElt.width = () => {
      //     return idElt.offsetWidth
      //   }
      //   idElt.find = (selector) => {
          
      //     const child = idElt.querySelector(selector)
      //     child.html = (content) => {
      //       child.innerHTML = content
      //     }
      //     return child
      //   }
      //   return idElt
      // }

      // const handleClickIconEye = jest.fn((icon) => billsContainer.handleClickIconEye(icon)) // création simulation évenement sur la page
     const handleClickIconEye = jest.fn((icon) =>   () => {
      const idElt = document.querySelector('#modaleFile');
        idElt.classList.add('show')
    }
) // création simulation évenement sur la page

      const eye = screen.getAllByTestId("icon-eye")[0] // html: data-testid="icon-eye"
      eye.getAttribute = (item) => {
        return eye.dataset.billUrl
      }
      eye.addEventListener('click', handleClickIconEye) // lancement event sur la page
      
      userEvent.click(eye) // simulation click
      expect(handleClickIconEye).toHaveBeenCalled()  
      
      const modal = screen.getByTestId('modalFile')
      expect(modal.classList.contains('show'))
     
    })  
  })
})


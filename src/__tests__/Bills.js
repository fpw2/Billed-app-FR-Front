/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { ROUTES,ROUTES_PATH} from "../constants/routes.js"
import {localStorageMock} from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import { bills } from "../fixtures/bills.js"
import router from "../app/Router.js"

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
      document.body.innerHTML = BillsUI({ data: bills}) // donnée fixtures bills
      const billsContainer = new Bills({document, onNavigate, store: null, bills: bills, localStorage: window.localStorage})
      
      // simulation jquery
      window.$ = (selector) => {
        const eltSelected = document.querySelector(selector);
        eltSelected.modal = (mode) => {
          eltSelected.classList.add(mode)
        }
        eltSelected.width = () => {
          return eltSelected.offsetWidth
        }
        eltSelected.find = (selector) => {
          const child = eltSelected.querySelector(selector)
          child.html = (content) => {
            child.innerHTML = content
          }
          return child
        }
        return eltSelected
      }

      const handleClickIconEye = jest.fn((e) => billsContainer.handleClickIconEye(e.target)) // création simulation évenement sur la page
      const eye = screen.getAllByTestId("icon-eye")[0] // html: data-testid="icon-eye" => le premier eye 
      eye.addEventListener('click', handleClickIconEye) // lancement event sur la page
      userEvent.click(eye) // simulation click
      expect(handleClickIconEye).toHaveBeenCalled() // si j'ai cliqué sur icon-eye 
      
      const modal = screen.getByTestId('modalFile')
      expect(modal.classList.contains('show')) // si la modale s'ouvre
     
    })     
  })

  //// Test API GET Bills ////
  describe("When I navigate to Bills page", () => {
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test("fetches bills from an API and fails with 404 message error", async () => {
        // après avoir simuler les rejet de la promesse, on vérifie l'affichage du message d'erreur
        Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick)
        const message = await screen.getByText("Erreur")
        expect(message).toBeTruthy()
      })
      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText("Erreur")
        expect(message).toBeTruthy()
      })
    })
  })
})


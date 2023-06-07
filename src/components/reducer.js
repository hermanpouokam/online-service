const userFromLocal = localStorage.getItem("userKilombo")
const productsFromLocal = localStorage.getItem("productsKilombo")
const customerFromLocal = localStorage.getItem("customerKilombo")
const employeeFromKilombo = localStorage.getItem("employeeKilombo")
const customerInfoFromLocal = localStorage.getItem("customerInfoKilombo")
const stockFromLocal = localStorage.getItem("stockKilombo")
const parfumFromLocal = localStorage.getItem("parfumKilombo")

export const initialState = {
    user: JSON.parse(userFromLocal) == null ? undefined : JSON.parse(userFromLocal),
    products: JSON.parse(productsFromLocal) == null ? undefined : JSON.parse(productsFromLocal),
    customer: JSON.parse(customerFromLocal) == null ? undefined : JSON.parse(customerFromLocal),
    employee: JSON.parse(employeeFromKilombo) == null ? undefined : JSON.parse(employeeFromKilombo),
    stock: JSON.parse(stockFromLocal) == null ? undefined : JSON.parse(stockFromLocal),
    parfum: JSON.parse(parfumFromLocal) == null ? undefined : JSON.parse(parfumFromLocal),
    customerInfo: JSON.parse(customerInfoFromLocal) == null ? undefined : JSON.parse(customerInfoFromLocal),
    refresh: false
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SIGN_IN':
            return {
                ...state,
                user: action.user
            }
        case 'SET_PRODUCTS':
            return {
                ...state,
                products: action.products
            }
        case 'ADD_CUSTOMER':
            return {
                ...state,
                customer: action.customers
            }
        case 'SET_STOCK':
            return {
                ...state,
                stock: action.stock
            }
        case 'SET_CUSTOMER':
            return {
                ...state,
                customerInfo: action.customer
            }
        case 'SET_EMPLOYEE':
            return {
                ...state,
                employees: action.employees
            }
        case 'SET_PARFUM':
            return {
                ...state,
                parfum: action.parfum
            }
        case 'REFRESH':
            return {
                ...state,
                refresh: action.payload
            }
        case 'SIGN_OUT':
            return {
                ...state,
                user: action.user
            }
        default:
            break;
    }
}

export default reducer
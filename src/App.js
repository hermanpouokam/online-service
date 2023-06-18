import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Customer from "./pages/customer/customer";
import Finances from "./pages/finances/Finances";
import History from "./pages/history/history";
import Home from "./pages/Home/Home";
import Orders from "./pages/orders/orders";
import Params from "./pages/params/params";
import Stock from "./pages/stock/stock";
import NewIncome from "./pages/orders/newIncome";
import Invoice from "./pages/orders/invoice";
import NewStock from "./pages/stock/newStock";
import Daily from "./pages/dialy/daily";
import Login from "./pages/auth/login";
import Users from "./pages/users/users";
import NewUser from "./pages/users/newUser";
import Error from "./errors/404";
import FinancesHistory from "./pages/finances/spendHistory";
import NewProduct from "./pages/stock/newProduct";
import NewCustomer from "./pages/customer/newCustomer";

const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: '/finances',
    element: <Finances />
  },
  {
    path: '/history',
    element: <History />
  },
  {
    path: '/customer',
    element: <Customer />
  },
  {
    path: '/customer/addCustomer',
    element: <NewCustomer />
  },
  {
    path: '/orders',
    element: <Orders />
  },
  {
    path: '/orders/page/:id',
    element: <Orders />
  },
  {
    path: '/stock',
    element: <Stock />
  },
  {
    path: '/stock/category/:category',
    element: <Stock />
  },
  {
    path: '/params',
    element: <Params />
  },
  {
    path: '/orders/neworder',
    element: <NewIncome />
  },
  {
    path: '/orders/orderdetails/:id',
    element: <Invoice />
  },
  {
    path: '/orders/neworder/:client',
    element: <NewIncome />
  },
  {
    path: '/stock/newsupply',
    element: <NewStock />
  },
  {
    path: '/stock/newproduct',
    element: <NewProduct />
  },
  {
    path: '/dailyclosure',
    element: <Daily />
  },
  {
    path: '/dailyclosure/search/:date',
    element: <Daily />
  },
  {
    path: '/users',
    element: <Users />
  },
  {
    path: '/users/newUser',
    element: <NewUser />
  },
  {
    path: '/finance/spend/history',
    element: <FinancesHistory />
  },
  {
    path: '*',
    element: <Error />
  }
]);

export default function App() {


  return (
    <RouterProvider router={router} />
  );
}

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
import SupplyHistory from "./pages/stock/history";
import Update from "./pages/update/update";
import DetailsPage from "./pages/customer/detailsPages";
import ErrorPage from "./errors/errorpage";

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
    element: <History />,
    errorElement: <ErrorPage />
  },
  {
    path: '/history/page/:page',
    element: <History />,
    errorElement: <ErrorPage />
  },
  {
    path: '/customer',
    element: <Customer />,
    errorElement: <ErrorPage />
  },
  {
    path: '/customer/:id/edit',
    element: <Update />,
    errorElement: <ErrorPage />
  },
  {
    path: '/customer/:id/details',
    element: <Update />
  },
  {
    path: '/customer/addCustomer',
    element: <NewCustomer />,
    errorElement: <ErrorPage />
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
    element: <Stock />,
    errorElement: <ErrorPage />
  },
  {
    path: '/stock/category/:category',
    element: <Stock />,
    errorElement: <ErrorPage />
  },
  {
    path: '/params',
    element: <Params />,
    errorElement: <ErrorPage />
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
    path: '/stock/supply/new',
    element: <NewStock />
  },
  {
    path: '/stock/supply/history',
    element: <SupplyHistory />
  },
  {
    path: '/stock/supply/history/page/:page',
    element: <SupplyHistory />
  },
  {
    path: '/stock/newproduct',
    element: <NewProduct />
  },
  {
    path: '/dailyclosure',
    element: <Daily />,
    errorElement: <ErrorPage />
  },
  {
    path: '/dailyclosure/search/:date',
    element: <Daily />,
    errorElement: <ErrorPage />
  },
  {
    path: '/users',
    element: <Users />,
    errorElement: <ErrorPage />
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

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { StateProvider } from "./components/stateProvider";
import reducer, { initialState } from "./components/reducer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./utils/protectedRoute";
import Login from "./pages/auth/login";
import Home from "./pages/Home/Home";
import Finances from "./pages/finances/Finances";
import Error from "./errors/404";
import History from "./pages/history/history";
import Daily from "./pages/dialy/daily";
import Customer from "./pages/customer/customer";
import Orders from "./pages/orders/orders";
import Stock from "./pages/stock/stock";
import Params from "./pages/params/params";
import Update from "./pages/update/update";
import Invoice from "./pages/orders/invoice";
import NewIncome from "./pages/orders/newIncome";
import NewStock from "./pages/stock/newStock";
import SupplyHistory from "./pages/stock/history";
import NewProduct from "./pages/stock/newProduct";
import NewUser from "./pages/users/newUser";
import NewCustomer from "./pages/customer/newCustomer";
import ErrorPage from "./errors/errorpage";
import { PDFViewer } from "@react-pdf/renderer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <PDFViewer>
        <BrowserRouter basename={'/'}>
          <Routes>
            <Route path='auth/login' element={<Login />} />
            <Route path="/" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="*" element={<App />} errorElement={<ErrorPage />}>

            </Route>
            <Route path="/finances" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <Finances />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/history" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/history/page/:page" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/customer" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <Customer />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/customer/addCustomer" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <NewCustomer />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/dailyclosure" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <Daily />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/customer/:id/details" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <Customer />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/customer/:id/edit" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <Customer />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/orders" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/orders/page/:id" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/stock" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <Stock />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/stock/category/:category" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <Stock />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/params" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <Update />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/orders/orderdetails/:id" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <Invoice />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/orders/neworder/:client" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <NewIncome />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/orders/neworder" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <NewIncome />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/stock/supply/new" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <NewStock />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/stock/supply/history" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <SupplyHistory />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/stock/newproduct" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <NewProduct />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/dailyclosure/search/:date" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <Daily />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/users" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <Update />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
            <Route path="/users/newUser" element={<App />}>
              <Route path=''
                element={
                  <ProtectedRoute>
                    <NewUser />
                  </ProtectedRoute>
                }
                errorElement={<Error />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </PDFViewer>
    </StateProvider>
  </React.StrictMode>
);

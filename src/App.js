import React, { useEffect } from "react";
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
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { useStateValue } from "./components/stateProvider";
import { auth, db } from "./firebase";
import moment from "moment";

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
  const [{ user, refresh, enterprise }, dispatch] = useStateValue()

  useEffect(() =>
    async () => {
      const q = query(collection(db, "articles"));
      const querySnapshot = await getDocs(q);
      let array = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        const id = doc.id
        array.push({ id, ...data })
      });
      if (array.length > 0) {
        sessionStorage.setItem('productsKilombo', JSON.stringify(array))
        dispatch({
          type: "SET_PRODUCTS",
          products: array
        })
      }
      dispatch({
        type: 'REFRESH',
        payload: false
      })
    }, [refresh])

  useEffect(() =>
    async () => {
      const q = query(collection(db, "stock"));
      const querySnapshot = await getDocs(q);
      let array = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        const id = doc.id
        array.push({ id, ...data })
      });
      if (array.length > 0) {
        let parfum = []
        for (let i = 0; i < array.length; i++) {
          const el = array[i];
          const q = query(collection(db, "parfum"), where("productCode", "==", el.productCode));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const data = doc.data()
            const id = doc.id
            parfum.push({ id, ...data })
          });

        }
        sessionStorage.setItem('parfumKilombo', JSON.stringify(parfum))
        dispatch({
          type: "SET_PARFUM",
          parfum: parfum
        })
        sessionStorage.setItem('stockKilombo', JSON.stringify(array))
        dispatch({
          type: "SET_STOCK",
          stock: array
        })
      }
      dispatch({
        type: 'REFRESH',
        payload: false
      })
    }, [refresh])

  useEffect(() =>
    async () => {
      const q = query(collection(db, "customer"));
      let customers = [];
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const id = doc.id
          const data = doc.data()
          customers.push({ id, ...data });
        });
        sessionStorage.setItem("customerKilombo", JSON.stringify(customers))
        dispatch({
          type: 'ADD_CUSTOMER',
          customers: customers
        });
      })
      const docRef = doc(db, "entreprise", user.enterprise);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()
        sessionStorage.setItem("enterprise", JSON.stringify(data))
        dispatch({
          type: 'SET_ENTERPRISE',
          payload: data
        });
      }

      const q1 = query(collection(db, "employee"));
      const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
        let employee = []
        querySnapshot.forEach((doc) => {
          const id = doc.id
          const data = doc.data()
          employee.push({ id, ...data });
        });
        sessionStorage.setItem("employeeKilombo", JSON.stringify(employee))
      })

      dispatch({
        type: 'REFRESH',
        payload: false
      })
    }, [refresh])


  useEffect(() => {

    const startDay = async () => {
      const docRef = doc(db, "dailyclosure", moment().format('DDMMYYYY'));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const check = async () => {
          let stock = []
          const q = query(collection(db, "stock"));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const data = doc.data()
            const id = doc.id
            stock.push({ id, ...data })
          });

          let dailyStock = []
          const subColRef = collection(db, "dailyclosure", moment().format('DDMMYYYY'), 'dailyStock');
          const qSnap = await getDocs(subColRef)
          dailyStock = qSnap.docs.map(d => ({ id: d.id, ...d.data() }))

          const uniqueResultArrayObjOne = stock.filter(function (objOne) {
            return !dailyStock.some(function (objTwo) {
              return objOne.id == objTwo.id;
            });
          });
          uniqueResultArrayObjOne.forEach(async function (docData) {
            await setDoc(doc(db, `dailyclosure`, `${moment().format('DDMMYYYY')}`, `dailyStock`, `${docData.id}`,), {
              stock: docData.stock,
              appro: 0,
              finalStock: 0
            });
          })

        }
        check()
      }
      await setDoc(doc(db, "dailyclosure", moment().format('DDMMYYYY')), {
        createdAt: serverTimestamp(),
        closed: false,
        caisse: parseInt(enterprise.caisse),
        marge: 0,
        depense: 0
      });
      const q = query(collection(db, "stock"));
      const querySnapshot = await getDocs(q);
      let array = []
      querySnapshot.forEach(async function (docData) {
        const data = docData.data()
        const id = docData.id
        await setDoc(doc(db, `dailyclosure`, `${moment().format('DDMMYYYY')}`, `dailyStock`, `${id}`,), {
          stock: data.stock,
          appro: 0,
          finalStock: 0
        });
      });
    }
    return () => {
      startDay()
    }
  }, [])

  return (
    <RouterProvider router={router} />
  );
}

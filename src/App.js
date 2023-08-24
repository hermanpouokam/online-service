import React, { useEffect, useState } from "react";
import {
  Outlet,
} from "react-router-dom";
import IdleTimeOutHandler from "./utils/IdleTimeOutHandler";
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { onAuthStateChanged } from "firebase/auth";
import { useStateValue } from "./components/stateProvider";
import { auth, db } from "./firebase";
import moment from 'moment'

export default function App() {

  const [isActive, setIsActive] = useState(true)
  const [isLogout, setLogout] = useState(false)
  const [{ user, refresh, enterprise, users }, dispatch] = useStateValue()
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    const getData = async () => {
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

      const q2 = query(collection(db, "users"));
      let users = [];
      const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const id = doc.id
          const data = doc.data()
          users.push({ id, ...data });
        });
        sessionStorage.setItem("usersKilombo", JSON.stringify(users))
        dispatch({
          type: 'SET_USERS',
          users: users
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
    }
    getData()
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
        return setLoading(false)
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
    startDay()
    setLoading(false)

  }, [refresh])

  useEffect(() => {
    
  }, []);


  return (
    <React.Fragment>
      <IdleTimeOutHandler
        onActive={() => { setIsActive(true) }}
        onIdle={() => { setIsActive(false) }}
        onLogout={() => { setLogout(true) }}
      />
      <Outlet />
    </React.Fragment>
  );
}

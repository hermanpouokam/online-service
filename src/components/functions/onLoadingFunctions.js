
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { useStateValue } from "../stateProvider";
import { db } from "../../firebase";

export function GetCustomer() {
    const [{ }, dispatch] = useStateValue()
    const q = query(collection(db, "customer"));
    const customers = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const id = doc.id
            const data = doc.data()
            customers.push({ id, ...data });
        });
    });
    sessionStorage.setItem("customerKilombo", JSON.stringify(customers))
    dispatch({
        type: 'ADD_CUSTOMER',
        customers: customers
    })
    return console.log("Current cities in CA: ", customers);
}

// const q = query(collection(db, "customer"));
// export const unsubscribe = onSnapshot(q, (querySnapshot) => {
//     const customers = [];
//     querySnapshot.forEach((doc) => {
//         const id = doc.id
//         const data = doc.data()
//         customers.push({ id, ...data });
//     });
//     sessionStorage.setItem("customerKilombo", JSON.stringify(customers))
//     dispatch({
//         type: 'ADD_CUSTOMER',
//         customers: customers
//     })
//     console.log("Current cities in CA: ", customers);
// });

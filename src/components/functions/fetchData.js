import React from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase"

export const getSpends = async () => {
    const docRef = collection(db, 'spends')
    const querySnapshot = await getDocs(docRef)
    const data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
    return new Promise((resole, reject) => {
        resole(data)
    })
}

export const getInvoices = async () => {
    const docRef = collection(db, 'invoices')
    const querySnapshot = await getDocs(docRef)
    const data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
    return new Promise((resole, reject) => {
        resole(data)
    })
}
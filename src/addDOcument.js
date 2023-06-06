import React from 'react'
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { customer, product } from './database';

export default function AddDOcument() {

  const addDocFirebase = async () => {
    for (let i = 0; i < customer.length; i++) {
      const el = customer[i];
      const docRef = await addDoc(collection(db, "customer"), {
        createdAt: serverTimestamp(),
        ...el
      })
      // console.log("Document written with ID: ", docRef.id);
    }

  }

  return (
    <div>
      <button onClick={addDocFirebase} class='form-control'>ajouter</button>
    </div>
  )
}

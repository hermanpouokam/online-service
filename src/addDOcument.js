import React from 'react'
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { customer, product } from './database';

export default function AddDOcument() {

  const addDocFirebase = async () => {
    for (let i = 0; i < product.length; i++) {
      const el = product[i];
      await setDoc(doc(db, "articles", el.code), {
        createdAt: serverTimestamp(),
        ...el
      });
      console.log("Document written with ID: ", el.code);
    }

  }

  return (
    <div>
      <button onClick={addDocFirebase} class='form-control'>ajouter</button>
    </div>
  )
}

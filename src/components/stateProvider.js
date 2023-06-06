import React, { createContext, useContext, useReducer } from 'react'

// prepares la couche de donneés
export const StateContext = createContext();

// Encadres l'App et lui fourni les donneés
export const StateProvider = ({ reducer, initialState, children }) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
);

//extraits des informations de la couche de données
export const useStateValue = () => useContext(StateContext);
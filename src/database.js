export let stock = [
    {
        id: 2,
        already: '15797',
        cat: 'sp',
        in: 300,
        item: "Planet 1,25L",
        lastUpdate: "mar. 17 dec 2022 - 8h30",
        price: 2350,
        type: 'jus',
        pv: [2350, 2400, 2450],
        minStock: 80,
    },
    {
        id: 1,
        already: 6790,
        in: 100,
        cat: 'sp',
        item: "supermont 1,5L",
        lastUpdate: "17 décembre 2022 à 10: 31: 09 UTC + 1",
        price: 1300,
        type: 'jus',
        pv: [1300, 1350, 1400],
        minStock: 80,
    },
    {
        id: 3,
        already: 407,
        in: 400,
        cat: 'sp',
        item: "Reaktor 0,5L",
        lastUpdate: "mar. 17 dec 2022 - 8h30",
        price: 3900,
        type: 'jus',
        pv: [4100, 4500, 4800],
        minStock: 80,
    },
    {
        id: 4,
        already: 2674,
        in: 250,
        cat: 'sabc',
        item: "Top 1L",
        lastUpdate: "mar. 17 dec 2022 - 8h30",
        price: 2375,
        type: 'jus',
        pv: [2375, 2450, 2500],
        minStock: 80,
    },
    {
        id: 5,
        already: '2674',
        in: 120,
        cat: 'brasserie',
        item: "Djino Cocktail 1L",
        lastUpdate: "mar. 17 dec 2022 - 8h30",
        price: 3250,
        type: 'jus',
        pv: [3350, 3400, 3500],
        minStock: 30,
    },
    {
        id: 6,
        already: '5097',
        in: 54,
        cat: 'sp',
        item: "Eau Supermont 10L",
        lastUpdate: "mar. 17 dec 2022 - 8h30",
        price: 3250,
        type: 'eau',
        pv: [950, 1000, 1050],
        minStock: 30,
    },
    {
        id: 6,
        already: '5097',
        in: 54,
        cat: 'sp',
        item: "Eau Supermont 1,5L",
        lastUpdate: "mar. 17 dec 2022 - 8h30",
        price: 1300,
        type: 'eau',
        pv: [1300, 1350, 1400],
        minStock: 30,
    }
]
export const customer = [
    {
        id: 1,
        nom: 'Depot armel et fils',
        tel: ['677889900', '699001122'],
        cat: 'Depot',
        location: 'Ngodi bakoko'
    },
    {
        id: 2,
        nom: 'Mr christian',
        tel: ['699551122'],
        cat: 'Depot',
        location: 'Yatchika'
    },
    {
        id: 3,
        nom: 'Ibrahim Boutique',
        tel: ['677889900', '699001122'],
        cat: 'Boutique',
        location: 'ngodi bakoko'
    },
    {
        id: 4,
        nom: 'Ets Amour',
        tel: ['677889900', '699001122'],
        cat: 'Bar',
        location: 'Ngodi bakoko'
    },
    {
        id: 1,
        nom: 'Depot armel et fils',
        tel: ['677889900', '699001122'],
        cat: 'Depot',
        location: 'Ngodi bakoko'
    },
    {
        id: 1,
        nom: 'Depot armel et fils',
        tel: ['677889900', '699001122'],
        cat: 'Depot',
        location: 'Ngodi bakoko'
    },
    {
        id: 1,
        nom: 'Depot armel et fils',
        tel: ['677889900', '699001122'],
        cat: 'Depot',
        location: 'Ngodi bakoko'
    }
]

export const months = ['jan', 'fev', 'mar', 'avr', 'mai', 'jui', 'juil', 'aout', 'sep', 'oct', 'nov', 'dec']


export const product = [
    {
        nom: 'planet 0,35L',
        fournisseur: 'sp',
        categorie: 'bg',
        code: 'PL35P',
        pu: 2350,
        parfum: [
            'pamplemouse',
            'ananas',
            'grenadine',
            'orange',
            'chapman',
            'pomme',
            'bbup lemon',
            'bbup lemon lime',
            'tropical',
            'cocktail',
            'bbup tonic',
            'american cola'
        ]
    },
    {
        nom: 'coca cola 1l',
        fournisseur: 'CCGBC',
        categorie: 'bg',
        code: 'COK10p',
        pu: 2893,
        parfum: []
    },
    {
        nom: 'Fanta 1l',
        fournisseur: 'CCGBC',
        categorie: 'bg',
        code: 'FT10P',
        pu: 2205,
        parfum: [
            'orange',
            'Fruit rouge',
            'Cocktail',
        ]
    },
    {
        nom: 'Fanta 0,5l',
        fournisseur: 'CCGBC',
        categorie: 'bg',
        code: 'FT05P',
        pu: 2720,
        parfum: [
            'orange',
            'Fruit rouge',
            'Cocktail',
        ]
    },
    {
        nom: 'Sprite 1l',
        fournisseur: 'CCGBC',
        categorie: 'bg',
        code: 'SPR10P',
        pu: 2877,
        parfum: []
    },
    {
        nom: 'planet 1,25L',
        fournisseur: 'sp',
        categorie: 'bg',
        code: 'PL125P',
        pu: 2350,
        parfum: [
            'pamplemouse',
            'ananas',
            'grenadine',
            'orange',
            'chapman',
            'pomme',
            'bbup lemon',
            'bbup lemon lime',
            'tropical',
            'cocktail',
            'american cola'
        ]
    },
    {
        nom: 'supermont 1,25l',
        fournisseur: 'sp',
        categorie: 'em',
        code: 'SP15P',
        parfum: [],
        pu: 1300,
    },
    {
        nom: 'supermont 0,5L',
        fournisseur: 'sp',
        categorie: 'em',
        code: 'SP05p',
        parfum: [],
        pu: 1750
    },
    {
        nom: 'supermont 10L',
        fournisseur: 'sp',
        categorie: 'em',
        code: 'SP10P',
        parfum: [],
        pu: 1750
    },
    {
        nom: 'opur 0,5L',
        fournisseur: 'sp',
        categorie: 'em',
        code: 'OP50P',
        parfum: [],
        pu: 1650
    },
    {
        nom: 'opur 1,5L',
        fournisseur: 'sp',
        categorie: 'em',
        code: 'OP15P',
        parfum: [],
        pu: 1150
    },
    {
        nom: 'opur 0,5L',
        fournisseur: 'sp',
        categorie: 'em',
        code: 'OP50P',
        parfum: [],
        pu: 1650
    },
    {
        nom: 'opur 10L',
        fournisseur: 'sp',
        categorie: 'em',
        code: 'OP10P',
        parfum: [],
        pu: 800
    },
    {
        nom: 'reaktor 0,5L',
        fournisseur: 'sp',
        categorie: 'bg',
        code: 'RK50P',
        pu: 3900,
        parfum: [
            'dark',
            'gold'
        ]
    },
    {
        nom: 'reaktor 0,33L',
        fournisseur: 'sp',
        categorie: 'bg',
        code: 'RK35P',
        pu: 2600,
        parfum: [
            'dark',
            'gold'
        ]
    },
    {
        nom: 'Top 1L',
        fournisseur: 'sabc',
        categorie: 'bg',
        code: 'TP1P',
        pu: 2375,
        parfum: [
            'pamplemouse',
            'ananas',
            'grenadine',
            'orange',
        ]
    },
    {
        nom: 'Top 0,35L',
        fournisseur: 'sabc',
        categorie: 'bg',
        code: 'TP35P',
        pu: 2800,
        parfum: [
            'pamplemouse',
            'ananas',
            'grenadine',
            'orange',
        ]
    },
    {
        nom: 'djino cocktail 1L',
        fournisseur: 'sabc',
        code: 'DJC1L',
        categorie: 'bg',
        parfum: [],
        pu: 3250,
    },
    {
        nom: 'Vimto 1L',
        fournisseur: 'sabc',
        categorie: 'bg',
        parfum: [],
        code: 'VIM1P',
        pu: 3850,
    },
    {
        nom: 'Vimto 0,35L',
        fournisseur: 'sabc',
        categorie: 'bg',
        code: 'VIM35P',
        parfum: [],
        pu: 3850,
    },
    {
        nom: 'orangina 1L',
        fournisseur: 'sabc',
        categorie: 'bg',
        code: 'ORG1P',
        parfum: [],
        pu: 3850,
    },
    {
        nom: 'world cola 1L',
        fournisseur: 'sabc',
        categorie: 'bg',
        code: 'WC1P',
        parfum: [],
        pu: 2950,
    },
    {
        nom: 'youzou 1L',
        fournisseur: 'sabc',
        categorie: 'bg',
        code: 'YZ1P',
        parfum: [],
        pu: 2950,
    },
    {
        nom: 'world cola 0,35L',
        fournisseur: 'sabc',
        categorie: 'bg',
        code: 'WC35P',
        parfum: [],
        pu: 3850,
    },
    {
        nom: 'orangina 0,35L',
        fournisseur: 'sabc',
        categorie: 'bg',
        code: 'ORG35P',
        parfum: [],
        pu: 3850,
    },
    {
        nom: 'vitale 1,5L',
        fournisseur: 'sabc',
        categorie: 'em',
        code: 'VIT1P',
        parfum: [],
        pu: 1000,
    },
    {
        nom: 'vitale 10L',
        fournisseur: 'sabc',
        categorie: 'em',
        code: 'VIT10P',
        parfum: [],
        pu: 1000,
    },
    {
        nom: 'special 1L',
        fournisseur: 'ucb',
        categorie: 'bg',
        code: 'SL1P',
        pu: 2900,
        parfum: [
            'pamplemouse',
            'grebandine',
            'orange',
            'lemon',
            'cola'
        ]
    },
    {
        nom: 'special 0,35L',
        fournisseur: 'ucb',
        categorie: 'bg',
        code: 'SL35P',
        pu: 2900,
        parfum: [
            'pamplemouse',
            'grebandine',
            'orange',
            'lemon',
            'cola'
        ]
    }
]

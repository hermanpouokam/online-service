// Créer un tableau d'objets avec des id et des noms
var objets = [
    {id: 1, nom: "Alice"},
    {id: 2, nom: "Bob"},
    {id: 1, nom: "Charlie"},
    {id: 3, nom: "David"},
    {id: 2, nom: "Eve"},
    {id: 3, nom: "Frank"}
  ];
  
  // Utiliser la méthode reduce pour regrouper les objets par id
  var groupes = objets.reduce(function (resultat, objet) {
    // Si le résultat n'a pas encore de propriété avec l'id de l'objet, créer un tableau vide
    if (!resultat[objet.id]) {
      resultat[objet.id] = [];
    }
    // Ajouter l'objet au tableau correspondant à son id
    resultat[objet.id].push(objet);
    // Retourner le résultat mis à jour
    return resultat;
  }, {}); // Passer un objet vide comme valeur initiale du résultat
  
  // Afficher le résultat dans la console
  console.log(groupes);
  
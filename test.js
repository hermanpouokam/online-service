const myArray = [{x: 1}, {x: 2}, {x: 3}];
const sum = myArray.reduce((accumulator, currentValue) => accumulator + currentValue.x, 0);
console.log(sum)
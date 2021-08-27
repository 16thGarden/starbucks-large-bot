
var num = 1230000.8199;
console.log(num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
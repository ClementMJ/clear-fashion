const dedicatedbrand = require('./sources/dedicatedbrand');
const adresse= require('./sources/adresse');
const mudjeans= require('./sources/mudjeans');
const Readline = require('readline'); 
const fs = require('fs');
const db = require('./db/index');


let AllProducts = [];

async function dedicated () {
  try {

    const pages = await dedicatedbrand.getPages('https://www.dedicatedbrand.com')

    console.log(pages);
    console.log("Nombre de lien:",pages.length);
    let NombreProduit = 0;
    for (var i = 0; i<pages.length; i++){
      console.log(pages[i]);
      const products = await dedicatedbrand.scrape(pages[i]);
      const result = await db.insert(products);
      console.log(products);
      console.log("Nombre de produits dans la page :",products.length)
      NombreProduit+=products.length;
    }    

    console.log("Nombre de produit total :",NombreProduit);

    let data = JSON.stringify(AllProducts);
    fs.writeFileSync('dedicated.json', data);
    console.log('done');
  } catch (e) {
    console.error(e);

  }
}

async function mdjeans () {
  try {
    let AllMudJeans = []
    const pages = await mudjeans.getPages('https://www.mudjeans.eu')

    console.log(pages);
    console.log("Nombre de lien:",pages.length);
    let NombreProduit = 0;
    for (var i = 0; i<pages.length; i++){
      console.log(pages[i]);
      const products = await mudjeans.scrape(pages[i]);
      const result = await db.insert(products);
      console.log(products);
      console.log("Nombre de produits dans la page :",products.length)
      NombreProduit+=products.length;
      
    }

    console.log("Nombre de produit total :",NombreProduit);

    let data = JSON.stringify(AllProducts);
    fs.writeFileSync('mdjeans.json', data);
    
    console.log('done');
  } catch (e) {
    console.error(e);
  }
} 

async function adress() {
  try {

    const products = await adresse.scrape('https://adresse.paris/630-toute-la-collection')

    console.log(products);

    const result = await db.insert(products);

    console.log("Nombre de produit total :",products.length);

    let data = JSON.stringify(products);
    fs.writeFileSync('address.json', data);

    console.log('done');
  } catch (e) {
    console.error(e);
    
  }
}


const [,, eshop] = process.argv;

const rl = Readline.createInterface({
    input : process.stdin,
    output : process.stdout,
    terminal : false
})

console.log("Type 1, 2, 3, 4");

rl.on('line', (input) => {
  console.log(`Received: ${input}`);
  if(input == 1){
    adress();
  }
  if(input == 2){
    dedicated();
  }
  if(input == 3){
    mdjeans();
  }
  if(input==4)
  {
    adress();
    mdjeans();
    dedicated();
  }
});
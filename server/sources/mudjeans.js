const axios = require('axios');
const cheerio = require('cheerio');
const MUD_JEANS = "https://mudjeans.eu";
/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
/*const parse = data => {
  const $ = cheerio.load(data);

  return $('.shopify-section.collection__landing .col.col-xs-6.col-md-3')
    .map((i, element) => {
      const name = $(element)
        .find('.product-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt($(element)
          .find('.product-price:first-child')
          .text()
          .replace(",00\n","")
          .replace("Buy€","")          
          )
      ;
      const lease = parseFloat($(element)
          .find('.product-price:nth-child(2)')
          .text()
          .replace("Lease for €","")
          .replace(",",".")                  
          )
      ;
      const brand = "mudjeans"
      return {brand,name, price,lease};
    })
    .get();
};*/
const parse = data => {
  const $ = cheerio.load(data);

  return $('.shopify-section.collection__landing .col.col-xs-6.col-md-3')
    .map((i, element) => {

      const brand = 'mudjeans';
      const name = $(element)
        .find('.product-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt($(element)
          .find('.product-price:first-child')
          .text()
          .replace(",00\n","").replace("Buy","").replace("€","")       
          )
      ;
      const lease = parseFloat($(element)
          .find('.product-price:nth-child(2)')
          .text()
          .replace("Lease for €","")
          .replace(",",".")                  
          )
      ;
      let photo = $(element)
        .find('.img.img--wrapper')
        .find("img")
        .attr("src");

      photo = "https:" + photo
      return {brand,name, price,lease,photo};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};

/**Parcourir les liens
*/
const parseLinks= data => {
  const $ = cheerio.load(data);

  return $('.header-navigation--primary .header-nav-list-item')
    .map((i, element) => {
      const link = $(element)
        .find('a').attr('href');
      return `${MUD_JEANS}${link}`
      })
    .get();
}

module.exports.getPages = async (url = MUD_JEANS) => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parseLinks(data);
  }

  console.error(status);

  return null;
};
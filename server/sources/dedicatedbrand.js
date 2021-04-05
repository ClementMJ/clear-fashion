const axios = require('axios');
const cheerio = require('cheerio');
const DEDICATED_BRAND = "https://www.dedicatedbrand.com"
/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */

const parse = data => {
  const $ = cheerio.load(data);

  return $('.productList-container .productList')
    .map((i, element) => {
      const link = `https://www.dedicatedbrand.com${$(element)
        .find('.productList-link')
        .attr('href')}`;

      return {
        link,
        'brand': 'dedicated',
        'price': parseInt(
          $(element)
            .find('.productList-price')
            .text()
        ),
        'name': $(element)
          .find('.productList-title')
          .text()
          .trim()
          .replace(/\s/g, ' '),
        'photo': $(element)
          .find('.productList-image img')
          .attr('src')
        //'_id': uuidv5(link, uuidv5.URL)
      };
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

  return $('.mainNavigation-fixedContainer .mainNavigation-link-subMenu-link')
    .map((i, element) => {
      const link = $(element)
        .find('a').attr('href');
      return `${DEDICATED_BRAND}${link}`
      })
    .get();
}

module.exports.getPages = async (url = DEDICATED_BRAND) => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parseLinks(data);
  }

  console.error(status);

  return null;
};
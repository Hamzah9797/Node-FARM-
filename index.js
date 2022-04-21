const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");
// a slug is a last unique part of url that helps us identigy it

const replaceTemplate = require("./modules/replaceTemplate");

// function

//server
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

// an arrayof all slugs
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

console.log(slugify("Fresh Avacados", { lower: true }));

const server = http.createServer((req, res) => {
  // console.log(req.url);
  //console.log(url.parse(req.url, true));
  // converted to an object

  const { query, pathname } = url.parse(req.url, true);

  // routing
  //const pathName = req.url;

  //-----------------Overview page
  if (pathname === "/overview" || pathname === "/") {
    //first thing we need to do is read template overview but we dont need to do it in here so we can do it outside

    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    // to convert it to one big string instaed of an array we added join-- because we are sending simple text html out not js
    //console.log(cardsHtml);

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    //-------------------Product page
  } else if (pathname === "/product") {
    //console.log(query);
    const product = dataObj[query.id];
    res.writeHead(200, { "Content-type": "text/html" });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });

    res.end("<h1>page not found</h1>");
  }
});

// strat a server
server.listen(8000, "127.0.0.1", () => {
  console.log("listening to request on port 8000");
});

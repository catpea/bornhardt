#!/usr/bin/env node

import express from 'express';
import path from 'node:path';

import * as marked from 'marked';

// Override function
const renderer = {

  list(token) {
    const ordered = token.ordered;
    const start = token.start;

    let body = '';
    for (let j = 0; j < token.items.length; j++) {
      const item = token.items[j];
      body += this.listitem(item);
    }

    const type = ordered ? 'ol' : 'ul';
    const startAttr = (ordered && start !== 1) ? (' start="' + start + '"') : '';
    return '<' + type + startAttr + ' class="list-unstyled">\n' + body + '</' + type + '>\n';
  },




  heading({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

    return `
            <h${depth}>
              <a name="${escapedText}" class="anchor" href="#${escapedText}">
                <span class="header-link"></span>
              </a>
              ${text}
            </h${depth}>`;
  }
};

marked.use({ renderer });

import beautify from 'js-beautify';
const beautiful = { html: { indent_size: 2 } };

import primaryLayout from './html/layout/primary.js';
import articleComponent from './html/components/article.js';
import articlesComponent from './html/components/articles.js';

import Storage from './modules/Storage.js';

const storageDirectory = path.join(import.meta.dirname, 'storage');
const storage = new Storage({ db: storageDirectory });
// storage.put({ id: 'alice-profile', name: 'Alice' });
// const alice = storage.get('alice-profile');
// console.log(alice);


const app = express();
export default app;

// Path to our public directory
const staticDirectory = path.join(import.meta.dirname, 'public');
app.use(express.static(staticDirectory));

// Dummy users
var users = [
  { name: 'tobi', email: 'tobi@learnboost.com' },
  { name: 'loki', email: 'loki@learnboost.com' },
  { name: 'jane', email: 'jane@learnboost.com' }
];

app.get('/', function(req, res){
  res.redirect('./main')
});

app.get('/:articleName', async function(req, res){

  const allowedArtiucleNameCharacters = /^[a-zA-Z0-9-]*$/;
  if (!allowedArtiucleNameCharacters.test(req.params.articleName)) {
    throw new Error("Article Name contains invalid characters.");
  }

  const articles = (await storage.all()).sort().map(name=>({name}));

  const navigation = articlesComponent({ articles }, {active: req.params.articleName});

  const articleName = req.params.articleName;
  const article = await storage.get(articleName);

  const body = articleComponent({
    name: articleName,
    text: marked.parse( article.text ),
  });

  const output = primaryLayout({navigation, body});
  res.send(beautify.html(output, beautiful.html));
});

app.listen(3000);
console.log('Express started on port 3000');

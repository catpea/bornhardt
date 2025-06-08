#!/usr/bin/env node

import express from 'express';
import { WebSocketServer } from 'ws';
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

import editorLayout from './html/layout/editor.js';
import editorComponent from './html/components/editor.js';

import Storage from './modules/Storage.js';

const storageDirectory = path.join(import.meta.dirname, 'storage');
const storage = new Storage({ db: storageDirectory });

// storage.put({ id: 'alice-profile', name: 'Alice' });
// const alice = storage.get('alice-profile');
// console.log(alice);
// ADD TIMESTAMP
// "updated":"2013-03-10T02:00:00.000Z",
// var date = new Date("2013-03-10T02:00:00Z");
// date.toISOString()


const app = express();
export default app;

// Path to our public directory
const staticDirectory = path.join(import.meta.dirname, 'public');
app.use(express.static(staticDirectory));

app.get('/', function(req, res){
  res.redirect('./main')
});

app.get('/edit/:articleName', async function(req, res){
  const allowedArticleNameCharacters = /^[a-zA-Z0-9-]*$/;
  if (!allowedArticleNameCharacters.test(req.params.articleName)) {
    throw new Error("Article Name contains invalid characters. DEBUG:" + req.params.articleName);
  }

  const articleName = req.params.articleName;
  const article = await storage.get(articleName);

  const body = editorComponent({
    name: articleName,
    ...article,
  });

  const navigation = "";
  const output = editorLayout({navigation, body});
  // res.send(beautify.html(output, beautiful.html));
  res.send(output);


})

app.get('/:articleName', async function(req, res){

  const allowedArticleNameCharacters = /^[a-zA-Z0-9-]*$/;
  if (!allowedArticleNameCharacters.test(req.params.articleName)) {
    throw new Error("Article Name contains invalid characters.");
  }

  const articles = (await storage.allData());

  const navigation = articlesComponent({ articles }, {active: req.params.articleName});

  const articleName = req.params.articleName;
  const article = await storage.get(articleName);

  const body = articleComponent({
    name: articleName,
    ...article,
    text: marked.parse( article.text ),
  });

  const output = primaryLayout({navigation, body});
  res.send(beautify.html(output, beautiful.html));

});

const server = app.listen(3000);
console.log('Express and socket started on port 3000');

const wss = new WebSocketServer({ server });

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', function connection(ws) {
  ws.isAlive = true;
  ws.on('error', console.error);
  ws.on('pong', heartbeat);

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    const action = JSON.parse(data);
    console.log('server received action from client:', action);
  });

  ws.send(JSON.stringify({type:'action', name:'server-start'}));

});

const clientPingInterval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', function close() {
  clearInterval(clientPingInterval);
});

function gracefulShutdown() {
  console.log('Shutting down gracefully...');
 clearInterval(clientPingInterval);
  server.close(() => {
    console.log('Server closed.');

    // Close any other connections or resources here

    process.exit(0);
  });

  // Force close the server after 5 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 5000);
}

// process.on('SIGTERM', gracefulShutdown);
// process.on('SIGINT', gracefulShutdown);

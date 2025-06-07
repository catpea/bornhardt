#!/usr/bin/env node
import beautify from 'js-beautify';
const beautiful = { html: { indent_size: 2 } };

import primaryLayout from './html/layout/primary.js';
import usersComponent from './html/components/users.js';

import express from 'express';
import path from 'node:path';

const app = express();
export default app;

// Path to our public directory
app.use(express.static(path.join(import.meta.dirname, 'public')));

// Dummy users
var users = [
  { name: 'tobi', email: 'tobi@learnboost.com' },
  { name: 'loki', email: 'loki@learnboost.com' },
  { name: 'jane', email: 'jane@learnboost.com' }
];

app.get('/', function(req, res){

  const body = usersComponent({
    users: users,
    title: "EJS example",
    header: "Some users"
  });

  const output = primaryLayout({body});
  res.send(beautify.html(output, beautiful.html));
});



  app.listen(3000);
  console.log('Express started on port 3000');

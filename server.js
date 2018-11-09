const express = require('express');
const serveStatic = require("serve-static");
const path = require('path');
app = express();
app.use(serveStatic(path.join(__dirname, 'dist')));
const port = process.env.PORT || 3000;
const redirectUlr='<a href="' + '/' +'">Redirect</a>';
app.get('/login', function (req, res) {
    res.send(redirectUlr);  
  });
app.listen(port, () => console.log('Gator app listening on port 3000!'));
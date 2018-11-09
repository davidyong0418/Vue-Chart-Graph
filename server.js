const express = require('express');
const serveStatic = require("serve-static");
const path = require('path');
app = express();
// app.use(serveStatic(path.join(__dirname, 'dist')));
const port = process.env.PORT || 3000;
onsole.log("dsafsadfsadfsadfsa");
app.listen(3000, () => console.log('Gator app listening on port 3000!'));

// const express = require('express');
// const app = express();

// app.get('/', (req, res) => {
//     res.send('An alligator approaches!');
// });

// app.listen(3000, () => console.log('Gator app listening on port 3000!'));
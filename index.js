const express = require('express');
const hbs = require('express-hbs');

const app = express();

// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine(
  'hbs',
  hbs.express4({
    partialsDir: __dirname + '/views/partials',
  }),
);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.render('home', {
    btnName: 'login',
  });
});
app.listen(PORT, () => console.log(`server started at localhost:${PORT}`));

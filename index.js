const express = require('express');
const hbs = require('express-hbs');
const session = require('express-session');

const app = express();

app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

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
  req.session.views = req.session.views || 1;

  res.render('home', {
    btnName: 'login',
    views: req.session.views++,
  });
});
app.listen(PORT, () => console.log(`server started at localhost:${PORT}`));

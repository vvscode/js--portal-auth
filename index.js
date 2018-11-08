const express = require('express');
const hbs = require('express-hbs');
const session = require('express-session');
const bodyParser = require('body-parser');
const crypt = require('./crypt');

const SETTINGS = require('./settings');

require('./portalMock');

const app = express();

app.use(bodyParser.json());

const getUid = _ =>
  Array.from({ length: 15 })
    .map(_ => String.fromCharCode(Math.floor(Math.random() * 26 + 97)))
    .join('');

const storage = {};

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

app.post(/\/loginCallbak.*$/, async (req, res) => {
  const dataDecrypted = await crypt.decrypt(
    SETTINGS.algorithm,
    SETTINGS.key,
    req.body.data,
  );
  const data = JSON.parse(dataDecrypted);
  const guid = getUid();
  storage[guid] = data.user;
  res.send(guid);
});

app.get(/\/loginRedirect.*$/, async (req, res) => {
  const dataPart = (req.url.match(/data=(.+)/) || []).pop();
  // @todo: potential replacement with plain string
  const dataDecrypted = await crypt.decrypt(
    SETTINGS.algorithm,
    SETTINGS.key,
    dataPart,
  );
  const data = JSON.parse(dataDecrypted);
  req.session.user = storage[data.guid];
  res.redirect(data.redirectUrl || '/');
});

app.get('*', async (req, res) => {
  req.session.views = req.session.views || 1;

  const data = await crypt.crypt(
    SETTINGS.algorithm,
    SETTINGS.key,
    JSON.stringify({
      redirectUrl: req.url,
    }),
  );

  res.render('home', {
    LOGIN_URL: SETTINGS.loginUrl(data),
    links: Array.from({ length: Math.floor(Math.random() * 10) + 3 }).map(
      getUid,
    ),
    user: JSON.stringify(req.session.user || null, null, 2),
    btnName: 'login',
    views: req.session.views++,
  });
});

app.listen(PORT, () => console.log(`server started at localhost:${PORT}`));

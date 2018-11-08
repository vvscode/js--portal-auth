const express = require('express');
const axios = require('axios');
const crypt = require('./crypt');

const SETTINGS = require('./settings');

const getUser = _ => ({
  gender: 'male',
  name: {
    title: 'mr',
    first: 'rolf',
    last: 'hegdal',
  },
  email: 'rolf.hegdal@example.com',
  nat: 'NO',
});

const app = express();

const PORT = 3003;
app.get(/\/loginAtPortal.*/, async (req, res) => {
  const dataPart = (req.url.match(/data=(.+)/) || ['']).pop();
  const decryptedData = await crypt.decrypt(
    SETTINGS.algorithm,
    SETTINGS.key,
    dataPart,
  );
  const data = JSON.parse(decryptedData);

  const guidPayload = await crypt.crypt(
    SETTINGS.algorithm,
    SETTINGS.key,
    JSON.stringify(
      {
        user: getUser(),
        redirectUrl: data.redirectUrl,
      },
      null,
      2,
    ),
  );

  axios
    .post(SETTINGS.loginCallbackUrl(), { data: guidPayload })
    .then(async response => {
      // @todo: possilbe place to have plain text instead of object
      const loginRedirectData = await crypt.crypt(
        SETTINGS.algorithm,
        SETTINGS.key,
        JSON.stringify({
          guid: response.data,
          redirectUrl: data.redirectUrl,
        }),
      );
      const redirectUrl = SETTINGS.loginRedirectUrl(loginRedirectData);
      res.redirect(redirectUrl);
    })
    .catch(e => res.send(e));
});

app.listen(PORT, () => console.log(`server started at localhost:${PORT}`));

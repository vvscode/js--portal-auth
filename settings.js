module.exports = {
  // global
  key: 'xxxxxx',
  algorithm: 'aes192',

  // client
  loginUrl: data => `http://localhost:3003/loginAtPortal?data=${data}`,
  logoutUrl: data => `http://localhost:3003/logoutAtPortal`,

  // portal
  loginCallbackUrl: data => 'http://localhost:3000/loginCallbak',
  loginRedirectUrl: data => `http://localhost:3000/loginRedirect&data=${data}`,
};

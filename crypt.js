const crypto = require('crypto');
module.exports = {
  crypt: (alg, key, val) => {
    const cipher = crypto.createCipher(alg, key);
    let encrypted = '';

    return new Promise(resolve => {
      cipher.on('readable', () => {
        const data = cipher.read();
        if (data) encrypted += data.toString('hex');
      });
      cipher.on('end', () => {
        resolve(encrypted);
      });

      cipher.write(val);
      cipher.end();
    });
  },
  decrypt: (alg, key, data) => {
    const decipher = crypto.createDecipher(alg, key);

    let decrypted = '';

    return new Promise(resolve => {
      decipher.on('readable', () => {
        const data = decipher.read();
        if (data) decrypted += data.toString('utf8');
      });
      decipher.on('end', () => {
        resolve(decrypted);
      });
      decipher.write(data, 'hex');
      decipher.end();
    });
  },
};

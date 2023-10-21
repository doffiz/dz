const qrcode = require('qrcode');

function generateQRCode(companyId) {
  return new Promise((resolve, reject) => {
    const qrData = `http://192.168.1.6:8081/company/${companyId}`;
    const qrOptions = {
      type: 'png',
      errorCorrectionLevel: 'H',
      scale: 8,
    };

    qrcode.toFile(`qrcodes/company_${companyId}.png`, qrData, qrOptions, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = generateQRCode;
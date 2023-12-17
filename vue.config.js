const fs = require('fs')

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
      disableHostCheck: true,
      port: 1025
      // https: {
      //   key: fs.readFileSync('./nginx.key'),
      //   cert: fs.readFileSync('./nginx.crt'),
      // },
      // public: 'http://applications-test-1.trembita.gov.ua:8080/'
  }
}
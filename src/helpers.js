// parsing source
var winston = require('winston');

module.exports = {
  extractType: function(target) {
    return Object.prototype.toString.call(target).replace('[object ', '').replace(']', '').toLowerCase();
  },
  logger: new (winston.Logger) ({
    transports: [
      new (winston.transports.Console)({
        level: 'error',
        colorize: true,
        timestamp: function() { return new Date().toLocaleString(); },
        prettyPrint: true
      })
    ]
  })
};



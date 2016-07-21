const _ = require('lodash');

let parsers = {
  csharp: require('./csharp-parser')
};

for(let prop in parsers) {
  Object.defineProperty(parsers[prop], 'lang', {
    configurable: true,
    enumerable:   false,
    get: function() {
      return prop;
    }
  });
 
  Object.defineProperty(parsers[prop], 'parse', {
    configurable: true,
    enumerable:   false,
    get: function() {
      return (code) => {
        let convention = {};
        for (let func in this) {
          let obj = {};
          obj[func] = this[func](code);
          _.merge(convention, obj);
        }
        return convention;
      };
    }
  });
}

module.export = parsers;

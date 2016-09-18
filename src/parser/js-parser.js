// JavaScript parser
const _ = require('lodash');

module.exports = {
  comma: (patch) => {
    const score = { first: 0, last: 0 };
    const first = /^\s*,.*/;
    const last = /.*,\s*$/;

    if (first.test(patch)) { score.first = score.first + 1; }
    if (last.test(patch)) { score.last = score.last + 1; }

    return score;
  },
  indent: (patch) => {
    const score = { tab: 0, space: 0 };
    const tab = /^\t+.*/;
    const space = /^\s+.*/;

    if (tab.test(patch)) { score.tab = score.tab + 1; }
    if (space.test(patch)) { score.space = score.space + 1; }

    return score;
  },
  functiondef: (patch) => {
    const score = { onespace: 0, nospace: 0 };
    const onespace = /function(\s+.)*\s+\(/;
    const nospace = /function(\s+.)*\(/;

    if (onespace.test(patch)) { score.onespace = score.onespace + 1; }
    if (nospace.test(patch)) { score.nospace = score.nospace + 1; }

    return score;
  },
  argumentdef: (patch) => {
    const score = { onespace: 0, nospace: 0 };
    const onespace = /(function|if|while|switch)(\s+\w*)?\s*\(\s+/;
    const nospace = /(function|if|while|switch)(\s+\w*)?\s*\(\S+/;

    if (onespace.test(patch)) { score.onespace = score.onespace + 1; }
    if (nospace.test(patch)) { score.nospace = score.nospace + 1; }

    return score;
  },
  literaldef: (patch) => {
    const score = { tracespace: 0, bothspace: 0, nospace: 0 };
    const tracespace = /\w:\s+[\w"'\/]/;
    const bothspace = /\w\s+:\s+[\w"'\/]/;
    const nospace = /\w:[\w"'\/]/;

    if (tracespace.test(patch)) { score.tracespace = score.tracespace + 1; }
    if (bothspace.test(patch)) { score.bothspace = score.bothspace + 1; }
    if (nospace.test(patch)) { score.nospace = score.nospace + 1; }

    return score;
  },
  conditionstatement: (patch) => {
    const score = { onespace: 0, nospace: 0 };
    const onespace = /(if|while|switch)\s+\(/;
    const nospace = /(if|while|switch)\(/;

    if (onespace.test(patch)) { score.onespace = score.onespace + 1; }
    if (nospace.test(patch)) { score.nospace = score.nospace + 1; }

    return score;
  },
  blockstatement: (patch) => {
    const score = { onespace: 0, nospace: 0, newline: 0 };
    const onespace = /((if|while|switch).*\)\s+\{)|(\}\s+else)/;
    const nospace = /((if|while|switch).*\)\{)|(\}else)/;
    const newline = /((if|while|switch).*\)\s*$)|((if|while|switch).*\)\s*\/[\/\*])|(^\s*else)/;

    if (onespace.test(patch)) { score.onespace = score.onespace + 1; }
    if (nospace.test(patch)) { score.nospace = score.nospace + 1; }
    if (newline.test(patch)) { score.newline = score.newline + 1; }

    return score;
  },
  linelength: (patch) => {
    const score = { char80: 0, char120: 0, char150: 0 };
    let width = patch.length;
    const tabcount = patch.split('\t').length - 1;
    width += tabcount * 3;

    if (width < 80) { score.char80 = score.char80 + 1; }
    else if (width < 120) { score.char120 = score.char120 + 1; }
    else { score.char150 = score.char150 + 1; }

    return score;
  },
  quotes: (patch) => {
    const score = { single: 0, double: 0 };

    const PLACEHOLDER = "CONVENTION-PLACEHOLDER";

    const singleQuote = function(line) {
      let temp = line.replace(/'.*?'/g, PLACEHOLDER);
      return (new RegExp("" + PLACEHOLDER)).test(temp) &&
             !(new RegExp("\"[\\w\\s<>/=]*" + PLACEHOLDER + "[\\w\\s<>/=]*\"")).test(temp) && (!/"/.test(temp));
    };
    const doubleQuote = function(line) {
      let temp = line.replace(/".*?"/g, PLACEHOLDER);
      return (new RegExp("" + PLACEHOLDER)).test(temp) &&
             !(new RegExp("'[\\w\\s<>/=]*" + PLACEHOLDER + "[\\w\\s<>/=]*'")).test(temp) && (!/'/.test(temp));
    };

    if (singleQuote(patch)) { score.single = score.single + 1; }
    if (doubleQuote(patch)) { score.double = score.double + 1; }

    return score;
  }
};

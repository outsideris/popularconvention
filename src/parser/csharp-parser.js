// C# parser
const _ = require('lodash');

module.exports = {
  indent: (patch) => {
    const score = { tab: 0, space: 0 };
    const tab = /^\t+.*/;
    const space = /^\s+.*/;

    if (tab.test(patch)) { score.tab = score.tab + 1; }
    if (space.test(patch)) { score.space = score.space + 1; }

    return score;
  },
  blockstatement: (patch) => {
    const score = { onespace: 0, nospace: 0, newline: 0 };
    const onespace = /((if|while|switch|try).*\s+\{)|(\}\s+(else|catch|finally).*\s+\{)/;
    const nospace = /((if|while|switch).*\)\{)|(try|else|finally)\{|(\}\s*(else|catch|finally).*\)\{)/;
    const newline = /((if|while|switch).*\)\s*$)|((if|while|switch).*\)\s*\/[\/\*])|(try|else|finally)\s*\/[\/\*]|(^\s*(else|catch|finally))/;

    if (onespace.test(patch)) { score.onespace = score.onespace + 1; }
    if (nospace.test(patch)) { score.nospace = score.nospace + 1; }
    if (newline.test(patch)) { score.newline = score.newline + 1; }

    return score;
  },
  constant: (patch) => {
    const score = { pascal: 0, allcaps: 0, notallcaps: 0 };
    const pascal = /const\s+\w+\s+([A-Z][a-z0-9]+)+\s*=/;
    const allcaps = /const\s+\w+\s+([A-Z0-9_]+)+\s*=/;
    const notallcaps = /const\s+\w+\s+([a-z][A-Za-z0-9_]*)+\s*=/;

    if (pascal.test(patch)) { score.pascal = score.pascal + 1; }
    if (allcaps.test(patch)) { score.allcaps = score.allcaps + 1; }
    if (notallcaps.test(patch)) { score.notallcaps = score.notallcaps + 1; }

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
  argumentdef: (patch) => {
    const score = { onespace: 0, nospace: 0 };
    const onespace = /^(\s*|\t*)(\w+\s+\w+\s+\w+|if|while|switch)\s*\(\s+/;
    const nospace = /^(\s*|\t*)(\w+\s+\w+\s+\w+|if|while|switch)\s*\(\S+/;

    if (onespace.test(patch)) { score.onespace = score.onespace + 1; }
    if (nospace.test(patch)) { score.nospace = score.nospace + 1; }

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
  }
};

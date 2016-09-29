// Java Parser
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
    const score = { allcaps: 0, notallcaps: 0 };

    const allcaps = /^\s*\w*\s*(static\s+\w*\s*final\s|final\s+\w*\s*static\s)\w+\s[A-Z0-9_]+(\s|=|;)/;
    const notallcaps = /^\s*\w*\s*(static\s+\w*\s*final\s|final\s+\w*\s*static\s)\w+\s[a-zA-Z0-9_]+(\s|=|;)/;

    if (allcaps.test(patch)) { score.allcaps = score.allcaps + 1; }
    if (!allcaps.test(patch) && notallcaps.test(patch)) { score.notallcaps = score.notallcaps + 1; }

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
  },
  staticvar: (patch) => {
    const score = { prefix: 0, noprefix: 0 };

    const prefix = /static\s+\w+\s+(_|\$)\w+/;
    const noprefix = /static\s+\w+\s+[^_$]\w+/;

    if (prefix.test(patch)) { score.prefix = score.prefix + 1; }
    if (noprefix.test(patch)) { score.noprefix = score.noprefix + 1; }

    return score;
  },
  finalstaticorder: (patch) => {
    const score = { accstfin: 0, accfinst: 0, finaccst: 0, staccfin: 0 };

    const accstfin = /^\w*\s*(public|private|protected){1}\s+\w*\s*(static){1}\s+\w*\s*(final|volatile){1}\s+\w+\s+[a-zA-Z0-9_]+(\s|=|;)/;
    const accfinst = /^\w*\s*(public|private|protected){1}\s+\w*\s*(final|volatile){1}\s+\w*\s*(static){1}\s+\w+\s+[a-zA-Z0-9_]+(\s|=|;)/;
    const finaccst = /^\w*\s*(final|volatile){1}\s+\w*\s*(public|private|protected){1}\s+\w*\s*(static){1}\s+\w+\s+[a-zA-Z0-9_]+(\s|=|;)/;
    const staccfin = /^\w*\s*(static){1}\s+\w*\s*(public|private|protected){1}\s+\w*\s*(final|volatile){1}\s+\w+\s+[a-zA-Z0-9_]+(\s|=|;)/;

    if (accstfin.test(patch)) { score.accstfin = score.accstfin + 1; }
    if (accfinst.test(patch)) { score.accfinst = score.accfinst + 1; }
    if (finaccst.test(patch)) { score.finaccst = score.finaccst + 1; }
    if (staccfin.test(patch)) { score.staccfin = score.staccfin + 1; }

    return score;
  }
};

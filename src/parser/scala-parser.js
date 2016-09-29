// Scala parser
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
  classname: (patch) => {
    const score = { capital: 0, nocapital: 0 };
    const capital = /(class|trait)\s+[A-Z][a-z0-9]+([A-Z][a-z0-9]+)*/;
    const nocapital = /(class|trait)\s+[a-z0-9]+([A-Z][a-z0-9]+)*/;

    if (capital.test(patch)) { score.capital = score.capital + 1; }
    if (nocapital.test(patch)) { score.nocapital = score.nocapital + 1; }

    return score;
  },
  variablename: (patch) => {
    const score = { camelcase: 0, noncamelcase: 0 };
    const camelcase = /(val|def|var)\s+[a-z]+([A-Z][a-z0-9])*/;
    const noncamelcase = /(val|def|var)\s+[A-Z][a-z]+([A-Z][a-z0-9])*/;

    if (camelcase.test(patch)) { score.camelcase = score.camelcase + 1; }
    if (noncamelcase.test(patch)) { score.noncamelcase = score.noncamelcase + 1; }

    return score;
  },
  parametertype: (patch) => {
    const score = { tracespace: 0, bothspace: 0, nospace: 0 };
    const tracespace = /def\s+\w+\(.*\s*\w+:\s+[A-Z]\w*/;
    const bothspace = /def\s+\w+\(.*\s*\w\s+:\s+[A-Z]\w*/;
    const nospace = /def\s+\w+\(.*\s*\w:[A-Z]\w*/;

    if (tracespace.test(patch)) { score.tracespace = score.tracespace + 1; }
    if (bothspace.test(patch)) { score.bothspace = score.bothspace + 1; }
    if (nospace.test(patch)) { score.nospace = score.nospace + 1; }

    return score;
  }
};

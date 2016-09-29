// Ruby parser
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
  whitespace: (patch) => {
    const score = { spaces: 0, nospace: 0 };

    const PLACEHOLDER = "CONVENTION-PLACEHOLDER";
    const operators = '[+=*/%>?:{}]';
    const symbols = '[,;]';

    const spaces = (patch) => {
      const temp = patch.replace(/'.*?'/g, PLACEHOLDER)
                        .replace(/".*?"/g, PLACEHOLDER);
      return !(new RegExp("\\w+" + operators)).test(temp) &&
             !(new RegExp("" + operators + "\\w+")).test(temp) &&
             !(new RegExp("" + symbols + "\\w+")).test(temp) &&
             (
               (new RegExp("\\s+" + operators + "\\s+")).test(temp) ||
               (new RegExp("\\s+" + symbols + "\\s+")).test(temp)
             );
    };
    const nospace = (patch) => {
      const temp = patch.replace(/'.*?'/g, PLACEHOLDER)
                        .replace(/".*?"/g, PLACEHOLDER);
      return (new RegExp("\\w+" + operators)).test(temp) ||
             (new RegExp("" + operators + "\\w+")).test(temp) ||
             (new RegExp("" + symbols + "\\w+")).test(temp);
    };

    if (spaces(patch)) { score.spaces = score.spaces + 1; }
    if (nospace(patch)) { score.nospace = score.nospace + 1; }

    return score;
  },
  asignDefaultValue: (patch) => {
    const score = { space: 0, nospace: 0 };
    const space = /^[\s\t]*def.*\((\s*\w+\s+=\s+[\[\]:\w,]+\s*)+\)/;
    const nospace = /^[\s\t]*def.*\((\s*\w+=[\[\]:\w,]+\s*)+\)/;

    if (space.test(patch)) { score.space = score.space + 1; }
    if (nospace.test(patch)) { score.nospace = score.nospace + 1; }

    return score;
  },
  numericLiteral: (patch) => {
    const score = { underscore: 0, nounderscore: 0 };
    const PLACEHOLDER = "CONVENTION-PLACEHOLDER";
    const underscore = function(line) {
      const temp = line.replace(/'.*?'/g, PLACEHOLDER)
                       .replace(/".*?"/g, PLACEHOLDER);
      return (/[0-9]+(_[0-9]{3,})+/).test(temp);
    };
    const nounderscore = function(line) {
      const temp = line.replace(/'.*?'/g, PLACEHOLDER)
                       .replace(/".*?"/g, PLACEHOLDER);
      return (/[0-9]{4,}/).test(temp);
    };

    if (underscore(patch)) { score.underscore = score.underscore + 1; }
    if (nounderscore(patch)) { score.nounderscore = score.nounderscore + 1; }

    return score;
  },
  defNoArgs: (patch) => {
    const score = { omit: 0, use: 0 };
    const omit = /^[\s\t]*def\s+\w+\s*[^(),\w]*(#+.*)*$/;
    const use = /^[\s\t]*def\s+\w+\s*\(\s*\)/;

    if (omit.test(patch)) { score.omit = score.omit + 1; }
    if (use.test(patch)) { score.use = score.use + 1; }

    return score;
  },
  defArgs: (patch) => {
    const score = { omit: 0, use: 0 };
    const omit = /^[\s\t]*def\s+\w+\s+\w[^()]*(#+.*)*$/;
    const use = /^[\s\t]*def\s+\w+\s*\((\s*[\w=]+,?)+\s*/;

    if (omit.test(patch)) { score.omit = score.omit + 1; }
    if (use.test(patch)) { score.use = score.use + 1; }

    return score;
  }
};

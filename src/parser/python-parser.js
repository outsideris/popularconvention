// Python parser
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
  imports: (patch) => {
    const score = { separated: 0, noseparated: 0 };
    const separated = /^\s*\t*import\s+[\w.]+([^,]\s*|\s*#.*)$/;
    const noseparated = /^\s*\t*import\s+\w+\s*,\s+\w+/;

    if (separated.test(patch)) { score.separated = score.separated + 1; }
    if (noseparated.test(patch)) { score.noseparated = score.noseparated + 1; }

    return score;
  },
  whitespace: (patch) => {
    const score = { noextra: 0, extra: 0 };
    const noextra = /\S+[\(\)\[\],]\S+|\S+:\s|\S\s=\s/;
    const extra = /\(\s+|\s+[\(\)\[\]]|\s+[:,]\s+|\s{2,}=|=\s{2,}/;

    if (extra.test(patch)) {
      score.extra = score.extra + 1;
    } else if (noextra.test(patch)) {
      score.noextra = score.noextra + 1;
    }
    return score;
  }
};

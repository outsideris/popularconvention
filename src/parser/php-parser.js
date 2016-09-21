// PHP parser
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
  classBrace: (patch) => {
    const score = { newline: 0, sameline: 0 };

    const newline = (patch) => {
      const temp = patch.replace(/\/\/.*/g, '');
      return (/^(\s|\\t)*class\s+\w+\s*(extends\s*\w+)?\s*$/).test(temp);
    };
    const sameline = (patch) => {
      const temp = patch.replace(/\/\/.*/g, '');
      return (/^(\s|\\t)*class\s+\w+\s*(extends\s*\w+)?\s+\{/).test(temp);
    };

    if (newline(patch)) { score.newline = score.newline + 1; }
    if (sameline(patch)) { score.sameline = score.sameline + 1; }

    return score;
  },
  controlBrace: (patch) => {
    const score = { sameline: 0, newline: 0 };

    const sameline = (patch) => {
      const temp = patch.replace(/\/\/.*/g, '');
      return (/((if|while|switch).*\{)|(\}\s*(else|elseif).*\{)/).test(temp);
    };
    const newline = (patch) => {
      const temp = patch.replace(/\/\/.*/g, '');
      return (/^\s*(((if|while|switch).*)|(\s*(else|elseif).*))[^{|:]$/).test(temp);
    };

    if (sameline(patch)) { score.sameline = score.sameline + 1; }
    if (newline(patch)) { score.newline = score.newline + 1; }

    return score;
  },
  methodBrace: (patch) => {
    const score = { sameline: 0, newline: 0 };

    const sameline = (patch) => {
      const temp = patch.replace(/\/\/.*/g, '');
      return (/^[\s|\t]*function\s+\w+\(.*?\)\s*\{/).test(temp);
    };
    const newline = (patch) => {
      const temp = patch.replace(/\/\/.*/g, '');
      return (/^[\s|\t]*function\s+\w+\(.*?\)\s*$/).test(temp);
    };

    if (sameline(patch)) { score.sameline = score.sameline + 1; }
    if (newline(patch)) { score.newline = score.newline + 1; }

    return score;
  },
  spaceAroundControl: (patch) => {
    const score = { space: 0, nospace: 0 };
    const space = /((if|elseif|while|for)\s+\(.*?\)\s+(\{|:))|(do\s+\{)/;
    const nospace = /((if|elseif|while|for)\(.*?\)(\{|:))|(do\{)/;

    if (space.test(patch)) { score.space = score.space + 1; }
    if (nospace.test(patch)) { score.nospace = score.nospace + 1; }

    return score;
  },
  spaceInsideControl: (patch) => {
    const score = { space: 0, nospace: 0 };
    const space = /(if|elseif|while|for)\s*\(\s+.+?\s+\)/;
    const nospace = /(if|elseif|while|for)\s*\(\S+.*?\S\)/;

    if (space.test(patch)) { score.space = score.space + 1; }
    if (nospace.test(patch)) { score.nospace = score.nospace + 1; }

    return score;
  },
  spaceAroundMethod: (patch) => {
    const score = { space: 0, nospace: 0 };
    const space = /^[\s\t]*function\s+\w+\s+\(.*?\)\s+\{/;
    const nospace = /^[\s\t]*function\s+\w+\(.*?\)\{/;

    if (space.test(patch)) { score.space = score.space + 1; }
    if (nospace.test(patch)) { score.nospace = score.nospace + 1; }

    return score;
  },
  spaceInsideMethod: (patch) => {
    const score = { space: 0, nospace: 0 };
    const space = /^[\s|\t]*function\s+\w+\s*\(\s+.+?\s+\)/;
    const nospace = /^[\s|\t]*function\s+\w+\s*\(\S+.*?\S\)/;

    if (space.test(patch)) { score.space = score.space + 1; }
    if (nospace.test(patch)) { score.nospace = score.nospace + 1; }

    return score;
  },
  className: (patch) => {
    const score = { camel: 0, pascal: 0, capssnake: 0, snakepascal: 0, snake: 0, uppersnake: 0 };

    const camel = /^[\s|\t]*class\s+[a-z][a-z0-9]*([A-Z][a-z0-9]+)+(\b|\s|\{)/;
    const pascal = /^[\s|\t]*class\s+([A-Z][a-z0-9]+){2,}(\b|\s|\{)/;
    const capssnake = /^[\s|\t]*class\s+([A-Z0-9]+_)+[A-Z0-9]+(\b|\s|\{)/;
    const snakepascal = /^[\s|\t]*class\s+(([A-Z][a-z0-9]+)_)+[A-Z][a-z0-9]+(\b|\s|\{)/;
    const snake = /^[\s|\t]*class\s+(([a-z][a-z0-9]+)_)+[a-z][a-z0-9]+(\b|\s|\{)/;
    const uppersnake = /^[\s|\t]*class\s+(([A-Z][a-z0-9]+)_)([a-z][a-z0-9]+_)+[a-z][a-z0-9]+(\b|\s|\{)/;

    if (camel.test(patch)) { score.camel = score.camel + 1; }
    if (pascal.test(patch)) { score.pascal = score.pascal + 1; }
    if (capssnake.test(patch)) { score.capssnake = score.capssnake + 1; }
    if (snakepascal.test(patch)) { score.snakepascal = score.snakepascal + 1; }
    if (snake.test(patch)) { score.snake = score.snake + 1; }
    if (uppersnake.test(patch)) { score.uppersnake = score.uppersnake + 1; }

    return score;
  },
  constName: (patch) => {
    const score = { camel: 0, pascal: 0, capssnake: 0, snakepascal: 0, snake: 0 };

    const camel = /(^[\s|\t]*const\s+[a-z][a-z0-9]*([A-Z][a-z0-9]+)+\s*=)|([\s|\t]*define\(s*['"][a-z][a-z0-9]*([A-Z][a-z0-9]+)+['"]s*,)/;
    const pascal = /(^[\s|\t]*const\s+([A-Z][a-z0-9]+){2,}\s*=)|([\s|\t]*define\(s*['"]([A-Z][a-z0-9]+){2,}['"]s*,)/;
    const capssnake = /(^[\s|\t]*const\s+([A-Z0-9]+_)+[A-Z0-9]+\s*=)|([\s|\t]*define\(s*['"]([A-Z0-9]+_)+[A-Z0-9]+['"]s*,)/;
    const snakepascal = /(^[\s|\t]*const\s+(([A-Z][a-z0-9]+)_)+[A-Z][a-z0-9]+\s*=)|([\s|\t]*define\(s*['"](([A-Z][a-z0-9]+)_)+[A-Z][a-z0-9]+['"]s*,)/;
    const snake = /(^[\s|\t]*const\s+(([a-z][a-z0-9]+)_)+[a-z][a-z0-9]+\s*=)|([\s|\t]*define\(s*['"](([a-z][a-z0-9]+)_)+[a-z][a-z0-9]+['"]s*,)/;

    if (camel.test(patch)) { score.camel = score.camel + 1; }
    if (pascal.test(patch)) { score.pascal = score.pascal + 1; }
    if (capssnake.test(patch)) { score.capssnake = score.capssnake + 1; }
    if (snakepascal.test(patch)) { score.snakepascal = score.snakepascal + 1; }
    if (snake.test(patch)) { score.snake = score.snake + 1; }

    return score;
  },
  functionName: (patch) => {
    const score = { camel: 0, pascal: 0, capssnake: 0, snakepascal: 0, snake: 0 };

    const camel = /function\s+[a-z][a-z0-9]*([A-Z][a-z0-9]+)+\s*\(/;
    const pascal = /function\s+([A-Z][a-z0-9]+){2,}\s*\(/;
    const capssnake = /function\s+([A-Z0-9]+_)+[A-Z0-9]+\s*\(/;
    const snakepascal = /function\s+(([A-Z][a-z0-9]+)_)+[A-Z][a-z0-9]+\s*\(/;
    const snake = /function\s+(([a-z][a-z0-9]+)_)+[a-z][a-z0-9]+\s*\(/;

    if (camel.test(patch)) { score.camel = score.camel + 1; }
    if (pascal.test(patch)) { score.pascal = score.pascal + 1; }
    if (capssnake.test(patch)) { score.capssnake = score.capssnake + 1; }
    if (snakepascal.test(patch)) { score.snakepascal = score.snakepascal + 1; }
    if (snake.test(patch)) { score.snake = score.snake + 1; }

    return score;
  },
  methodDeclare: (patch) => {
    const score = { staticlate: 0, staticfirst: 0, abstractlate: 0, abstractfirst: 0 };

    const staticlate = /(public|protected|private)\s+static\s+\$*\w*/;
    const staticfirst = /static\s+(public|protected|private)\s+\$*\w*/;
    const abstractlate = /(public|protected|private)\s+(abstract|final)\s+\$*\w*/;
    const abstractfirst = /(abstract|final)\s+(public|protected|private)\s+\$*\w*/;

    if (staticlate.test(patch)) { score.staticlate = score.staticlate + 1; }
    if (staticfirst.test(patch)) { score.staticfirst = score.staticfirst + 1; }
    if (abstractlate.test(patch)) { score.abstractlate = score.abstractlate + 1; }
    if (abstractfirst.test(patch)) { score.abstractfirst = score.abstractfirst + 1; }

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

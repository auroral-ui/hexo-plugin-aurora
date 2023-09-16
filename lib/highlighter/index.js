const shiki = require('shiki');
const { BUNDLED_LANGUAGES, toShikiTheme } = require('shiki');
const appRootPath = require('app-root-path');
const { lex, parse } = require('fenceparser');
const { sleep } = require('deasync');
const { throwWarning } = require('../helpers/utils');
const chalk = require('chalk');

const styleRE = /<pre[^>]*(style=".*?")/;
const preRE = /^<pre(.*?)>/;
const lineNoRE = /:(no-)?line-numbers(=\d*)?$/;
const defaultLang = 'txt';

function cleanup(str, bg) {
  let cleanedStr = str.replace(
    preRE,
    (_, attributes) => `<pre ${vPre}${attributes.replace(' tabindex="0"', '')}>`
  );

  if (bg) {
    cleanedStr = cleanedStr.replace(styleRE, (_, style) =>
      _.replace(style, bg ? `style="background-color: ${bg}"` : '')
    );
  }

  return cleanedStr;
}

function renderCodeBlock(codeHtml, lang) {
  return `<div class="language-${lang}"><button title="Copy code" class="copy"></button><span class="lang">${lang}</span>${codeHtml}</div>`;
}

function filterIntoShiki(
  highlighter,
  code,
  lang,
  options = { theme: 'material-theme-palenight', backgroundColor: undefined }
) {
  const { theme, backgroundColor } = options;

  lang = lang.replace(lineNoRE, '').toLowerCase() || defaultLang;

  if (lang) {
    const langLoaded = highlighter.getLoadedLanguages().includes(lang);
    if (!langLoaded && lang !== 'ansi' && lang !== 'txt') {
      throwWarning(
        'Aurora Code Filtering Warning',
        `Code language: ${chalk.cyan(
          `[${lang}]`
        )} is not loaded, falling back to '${defaultLang}' for syntax highlighting.`
      );
      lang = defaultLang;
    }
  }

  const codeHtml = highlighter.codeToHtml(code, {
    lang,
    theme
  });
  return cleanup(renderCodeBlock(codeHtml, lang), backgroundColor);
}

function parseFence(infoString) {
  if (!infoString) {
    return {
      lang: defaultLang,
      meta: {}
    };
  }

  const tokens = lex(infoString);

  return {
    lang: tokens.shift() ?? '',
    meta: parse(tokens)
  };
}

// Register to the marked markdown renderer that we want to take over
// rendering code blocks
// Temporary 'deasync' method, can use `hexo.extend.highlight` in Hexo 7+
// TODO: When Hexo 7 release check this plugin: @see https://github.com/Pcrab/hexo-highlight-shiki/blob/main/src/index.js
module.exports = (hexo) => {
  hexo.extend.filter.register('marked:renderer', function (renderer) {
    const themeConfig = Object.assign(hexo.theme.config || {}, hexo.config.theme_config);
    const {
      enable,
      theme = 'material-theme-palenight',
      customTheme,
      backgroundColor
    } = themeConfig.shiki ?? {
      enable: false,
      theme: undefined,
      backgroundColor: undefined,
      customTheme: undefined
    };
    let highlighter = undefined;
    let codeTheme = theme;

    if (customTheme) {
      codeTheme = toShikiTheme(require(appRootPath + customTheme));
    }

    if (!enable) return;

    shiki
      .getHighlighter({
        theme: codeTheme,
        langs: [...BUNDLED_LANGUAGES]
      })
      .then((hl) => (highlighter = hl));

    if (!highlighter) {
      let count = 10000 / 200;
      while (!highlighter) {
        sleep(200);
        count -= 1;
        if (count <= 0)
          throw new Error(
            "Could not get Shiki loaded async via 'deasync'. Hexo doesn't have an API for async plugins, and Shiki needs this for the WASM syntax highlighter. You can try using a different version of node, or requesting APIs at https://github.com/11ty/eleventy"
          );
      }
    }

    renderer.code = function (code, infoString) {
      fenceData = parseFence(infoString);
      return filterIntoShiki(highlighter, code, fenceData.lang, {
        theme: codeTheme,
        backgroundColor
      });
    };
  });
};

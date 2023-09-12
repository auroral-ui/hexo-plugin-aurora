const shiki = require('shiki');
const { renderToHtml, toShikiTheme } = require('shiki');
const { escapeHTML } = require('hexo-util');
const appRootPath = require('app-root-path');
const { lex, parse } = require('fenceparser');
const { sleep } = require('deasync');
const { throwWarning } = require('../helpers/utils');
const chalk = require('chalk');

function defaultCodeBlock(code, lang) {
  return `<div class="language-${lang}"><button title="Copy code" class="copy"></button><span class="lang">${lang}</span>${escapeHTML(
    code
  )}</div>`;
}

function filterIntoShiki(
  highlighter,
  code,
  lang,
  options = { theme: 'material-theme-palenight', backgroundColor: undefined }
) {
  const { theme, backgroundColor } = options;

  if (highlighter.getLoadedLanguages().includes(lang)) {
    // This will return an array of tokens for the provided code.
    // A token represents a single part of the code, for example a keyword, a string, a comment, etc.
    const tokens = highlighter.codeToThemedTokens(code, lang, theme);
    //
    // // This will return an HTML string that represents the provided code.
    const codeHtml = renderToHtml(tokens, {
      bg: backgroundColor ?? highlighter.getBackgroundColor(theme)
    });

    return `<div class="language-${lang}"><button title="Copy code" class="copy"></button><span class="lang">${lang}</span>${codeHtml}</div>`;
  }

  if (lang !== '') {
    throwWarning(
      'Aurora Code Filtering Warning',
      `Code language: ${chalk.cyan(`[${lang}]`)} is not supported.`
    );
  } else {
    lang = 'plaintext';
  }

  return defaultCodeBlock(code, lang);
}

function parseFence(infoString) {
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
        theme: codeTheme
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

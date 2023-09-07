'use strict';

const { getHighlighter, renderToHtml } = require('shiki');
const { throwWarning } = require('../../helpers/utils');
const chalk = require('chalk');
const { escapeHTML } = require('hexo-util');

const rBacktick =
  /^((?:[^\S\r\n]*>){0,3}[^\S\r\n]*)(`{3,}|~{3,})[^\S\r\n]*((?:.*?[^`\s])?)[^\S\r\n]*\n((?:[\s\S]*?\n)?)(?:(?:[^\S\r\n]*>){0,3}[^\S\r\n]*)\2[^\S\r\n]?/gm;

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
      'Aurora Code Filtering Error',
      `Code language: ${chalk.cyan(`[${lang}]`)} is not supported.`
    );
  } else {
    lang = 'plaintext';
  }

  return `<div class="language-${lang}"><button title="Copy code" class="copy"></button><span class="lang">${lang}</span>${escapeHTML(
    code
  )}</div>`;
}

module.exports = (hexo) =>
  async function filterBackTicks(data) {
    let highlighter = undefined;
    const dataContent = data.content;

    if (!dataContent.includes('```') && !dataContent.includes('~~~')) return;

    const themeConfig = Object.assign(hexo.theme.config || {}, hexo.config.theme_config);
    const { enable, theme, backgroundColor } = themeConfig.shiki ?? {
      enable: false,
      theme: undefined,
      backgroundColor: undefined
    };
    const codeTheme = theme ?? 'material-theme-palenight';

    if (enable) {
      highlighter = await getHighlighter({
        theme: codeTheme
      });
    }

    data.content = dataContent.replace(rBacktick, (matchedCode, start, backTicks, lang, code) => {
      if (!enable) return matchedCode;

      return filterIntoShiki(highlighter, code.replace(/\n$/, ''), lang, {
        theme: codeTheme,
        backgroundColor
      });
    });
  };

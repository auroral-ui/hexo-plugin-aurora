const appRoot = require('app-root-path');
const chalk = require('chalk');
const pluginPack = require('./package.json');
const { throwInfo, throwError } = require('./lib/helpers/utils');

require('./lib/highlighter')(hexo);
require('./lib/filters')(hexo);
require('./lib/generators')(hexo);
require('./lib/injector')(hexo);
require('./lib/commands')(hexo);

var themePack;

try {
  themePack = require(appRoot + '/node_modules/hexo-theme-aurora/package.json');
} catch (error) {
  throwInfo(
    'Aurora Plugin',
    `Aurora Plugin fail to get current Aurora Theme version from package location, trying to get from themes folder instead...`
  );
  try {
    themePack = require(appRoot + '/themes/aurora/package.json');
  } catch (error) {
    throwError(
      'Aurora Plugin Error',
      `Aurora Plugin fail to get current Aurora Theme version, please make sure you have the theme installed.`
    );
    return;
  }
}

hexo.on('generateAfter', function () {
  console.log(
    chalk.green('INFO  ') +
      chalk.yellow('API data generated with ') +
      chalk.cyan.bold('hexo-plugin-aurora') +
      chalk.magenta(' v' + pluginPack.version)
  );
});

hexo.on('exit', function () {
  console.log(
    chalk.green('INFO  ') +
      'Thanks for using: ' +
      chalk.cyan.bold('hexo-plugin-aurora') +
      chalk.magenta(' v' + pluginPack.version) +
      ' & ' +
      chalk.cyan.bold('hexo-theme-aurora') +
      chalk.magenta(' v' + themePack.version)
  );
  console.log(chalk.green('INFO  ') + 'Crafted by ' + chalk.cyan.bold('bennyxguo <三钻>'));
});

const chalk = require('chalk');
const appRoot = require('app-root-path');
const { throwError, throwInfo } = require('./lib/helpers/utils');
const pluginPack = require('./package.json');
require('./lib/filters')(hexo);
require('./lib/generators')(hexo);
require('./lib/injector')(hexo);

var pack;

try {
  pack = require(appRoot + '/node_modules/hexo-theme-aurora/package.json');
} catch (error) {
  throwInfo(
    'Aurora Plugin',
    `Aurora Plugin fail to get current Aurora Theme version from package location, trying to get from themes folder instead...`
  );
  try {
    pack = require(appRoot + '/themes/hexo-theme-aurora/package.json');
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
      chalk.magenta(' v' + pack.version)
  );
  console.log(chalk.green('INFO  ') + 'Crafted by ' + chalk.cyan.bold('bennyxguo <三钻>'));
});

const algoliaCommand = require('./algolia');

module.exports = function (hexo) {
  hexo.extend.console.register(
    'algolia',
    'Index your posts on Algolia',
    {
      options: [
        {
          name: '-n, --no-clear',
          desc: 'Does not clear the existing index'
        }
      ]
    },
    (options, callback) => {
      algoliaCommand(hexo, options, callback);
    }
  );
};

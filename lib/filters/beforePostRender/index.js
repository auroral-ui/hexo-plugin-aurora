'use strict';

module.exports = (hexo) => {
  const { filter } = hexo.extend;

  filter.register('before_post_render', require('./backtick-code-block')(hexo));
};

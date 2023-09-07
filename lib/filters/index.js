module.exports = function (hexo) {
  require('./afterPostRender')(hexo);
  require('./beforePostRender')(hexo);
};

exports.notfound = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '',
    isAuth: req.session.isLoggedIn,
  });
};

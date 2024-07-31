const jwt = require('jsonwebtoken');

function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/');
  
    jwt.verify(token, 'shhhhh', (err, user) => {
      if (err) return res.redirect('/');
      req.user = user;
      next();
    });
}

function isNotLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) return next();

    jwt.verify(token, 'shhhhh', (err, user) => {
        if (err || !user) return res.redirect('/');
        else if(user) return res.redirect(`/profile/${user._id}`);
        next();
    });
}

module.exports = {
    isLoggedIn,
    isNotLoggedIn,   
}
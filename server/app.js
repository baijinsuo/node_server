var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const expressJWT = require('express-jwt')
const { PRIVATE_KEY } = require('./utils/constant');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article')
var commentRouter = require('./routes/comment')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//请求拦截，expressJwt解密
app.use(expressJWT({
  secret: PRIVATE_KEY,
  algorithms: ["HS256"], //加密算法需要设置一致，jsonwebtoken默认加密算法为HS256
}).unless({
  path: ['/api/user/register', '/api/user/login', '/api/user/upload','/api/article/getArticleList','/api/article/getBlogDetail','/api/comment/getCommentsList']  //白名单,除了这里写的地址，其他的URL都需要验证
}));

//注册路由
app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/article', articleRouter);
app.use('/api/comment', commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({ code: 0, msg: 'token验证失败' });
  } else {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;

var express = require('express');
var router = express.Router();
const querySql = require('../db/index');
const { PWD_SALT, PRIVATE_KEY, EXPIRESD, DOMAIN } = require('../utils/constant');
const { md5, upload, getTokenUserInfo } = require('../utils/index');
const jwt = require('jsonwebtoken');
const { json } = require('express');


/* 注册接口 */
router.post('/register', async (req, res, next) => {
  let { username, password, nickname } = req.body;
  try {
    let user = await querySql('select * from user where username=?', [username]);
    if (!user || user.length === 0) {
      password = md5(`${password}${PWD_SALT}`);
      await querySql('insert into user(username,password,nickname) value(?,?,?)', [username, password, nickname]);
      res.send({ code: 1, msg: '注册成功' });
    } else {
      res.send({ code: 0, msg: '该账号已注册' })
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/**
 * 登录接口
 */
router.post('/login', async (req, res, next) => {
  let { username, password } = req.body;
  password = md5(`${password}${PWD_SALT}`);
  try {
    let user = await querySql('select * from user where username=? and password=?', [username, password]);
    if (user && user.length > 0) {
      let token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: EXPIRESD });
      res.send({ code: 1, msg: '登录成功', token: token });
    } else {
      res.send({ code: 0, msg: '账号不存在或密码错误!' });
    }
  } catch (error) {
    next(error);
  }
});


/**
 * 获取用户信息接口，根据token获取信息
 */
router.get('/info', async (req, res, next) => {
  let username = getTokenUserInfo(req.user, 'username');
  try {
    let userinfo = await querySql('select nickname,avatars from user where username = ?', [username])
    let result = null;
    if (userinfo) {
      let data = JSON.parse(JSON.stringify(userinfo[0]))
      result = {
        nickname: data.nickname,
        avatars: DOMAIN + data.avatars
      }
    }
    res.send({ code: 1, msg: '成功', data: result })
  } catch (e) {
    next(e)
  }
})

/**
 * 上传头像接口
 */
router.post('/upload', upload.single('avatars'), async (req, res, next) => {
  let avatarsPath = req.file.path.split('public')[1];
  let imgUrl = DOMAIN + avatarsPath;
  res.send({ code: 1, msg: '上传成功', data: imgUrl });
})

/**
 * 更新个人信息
 */
router.post('/updateUser', async (req, res, next) => {
  let { nickname, avatars } = req.body;
  let username = getTokenUserInfo(req.user, 'username');
  if (avatars)
    avatars = avatars.substr(avatars.split('uploads')[0].length);
  try {
    let result = await querySql('update user set nickname= ?, avatars= ? where username= ? ', [nickname, avatars, username])
    res.send({ code: 1, msg: '更新成功', data: null })
  } catch (e) {
    next(e)
  }
})

module.exports = router;

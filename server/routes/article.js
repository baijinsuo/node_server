/**
 * 功  能：博客管理
 * 创建人：白金索
 * 创建时间：2020.9.11
 */

var express = require('express');
var router = express.Router();
const querySql = require('../db/index');
const { getTokenUserInfo, getAffectedRows } = require('../utils/index');

/* 新增博客接口 */
router.post('/add', async (req, res, next) => {
    let { title, content } = req.body;
    let user_id = getTokenUserInfo(req.user, 'id');
    try {
        await querySql('insert into article(title,content,user_id,create_time) values(?,?,?,NOW())', [title, content, user_id]);
        res.send({ code: 1, msg: '新增成功', data: null })
    } catch (e) {
        next(e)
    }
});


/* 获取博客列表 */
router.post('/getArticleList', async (req, res, next) => {
    try {
        let result = await querySql('select DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") as create_time,title,content,id,user_id from article');
        res.send({ code: 1, msg: '获取成功', data: result })
    } catch (e) {
        next(e)
    }
});


/* 获取我的博客列表 */
router.post('/getMyBlogList', async (req, res, next) => {
    let user = getTokenUserInfo(req.user);
    try {
        let result = await querySql('select DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") as create_time,title,content,id,user_id from article where user_id= ? ', [user.id]);
        res.send({ code: 1, msg: '获取成功', data: result })
    } catch (e) {
        next(e)
    }
});


/* 获取博客详情列表 */
router.post('/getBlogDetail', async (req, res, next) => {
    const { article_id } = req.body;
    try {
        let result = await querySql('select DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") as create_time,title,content,id,user_id from article where id= ? ', [article_id]);
        res.send({ code: 1, msg: '获取成功', data: result[0] })
    } catch (e) {
        next(e)
    }
});


/* 更新博客内容 */
router.post('/update', async (req, res, next) => {
    let user_id = getTokenUserInfo(req.user, 'id');
    let { article_id, title, content } = req.body;
    try {
        let result = await querySql('update article set title= ?,content= ? where id= ? and user_id= ? ', [title, content, article_id, user_id]);
        if (getAffectedRows(result) > 0) {
            res.send({ code: 1, msg: '更新成功', data: null })
        }
        else {
            res.send({ code: 0, msg: '更新失败', data: null })
        }
    } catch (e) {
        next(e)
    }
});


/* 删除博客内容 */
router.post('/delete', async (req, res, next) => {
    let user_id = getTokenUserInfo(req.user, 'id');
    let { article_id} = req.body;
    try {
        let result = await querySql('delete from article where id= ? and user_id= ?',[article_id,user_id]);
        if (getAffectedRows(result) > 0) {
            res.send({ code: 1, msg: '删除成功', data: null })
        }
        else {
            res.send({ code: 0, msg: '删除失败', data: null })
        }
    } catch (e) {
        next(e)
    }
});


module.exports = router;

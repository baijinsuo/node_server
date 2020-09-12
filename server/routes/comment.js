/**
 * 功  能：发表评论
 * 创建人：白金索
 * 创建时间：2020.9.12
 */

var express = require('express');
var router = express.Router();
const querySql = require('../db/index');
const { getTokenUserInfo, getAffectedRows, isEmpty } = require('../utils/index');
const { DOMAIN } = require('../utils/constant');

/* 发表评论 */
router.post('/comments', async (req, res, next) => {
    let { content, article_id } = req.body;
    if (isEmpty(content.trim())) {
        res.send({ code: 0, msg: '评论内容不能为空', data: null });
        return;
    }
    let user = getTokenUserInfo(req.user);
    try {
        let result = await querySql('insert into comment(content,user_id,article_id,avatars,nickname,create_time) values(?,?,?,?,?,NOW())', [content, user.id, article_id, user.avatars, user.nickname]);
        if (getAffectedRows(result) > 0) {
            res.send({ code: 1, msg: '评论成功', data: null })
        }
        else {
            res.send({ code: 0, msg: '评论失败', data: null })
        }
    } catch (e) {
        next(e)
    }
});

/* 获取文章评论列表 */
router.post('/getCommentsList', async (req, res, next) => {
    let { article_id } = req.body;
    try {
        let result = await querySql('select DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") as create_time,content,avatars,nickname from comment where article_id= ?', [article_id]);
        if (!isEmpty(result)) {
            result.map(item => {
                item.avatars = DOMAIN + item.avatars;
            });
        }
        res.send({ code: 1, msg: '获取评论成功', data: result });
    } catch (e) {
        next(e)
    }
});

module.exports = router;

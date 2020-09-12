const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs')
const path = require('path')

/* md5加密 */
function md5(s) {
    return crypto.createHash('md5').update(String(s)).digest('hex');
}

/* 上传文件 */
let upload = multer({
    storage: multer.diskStorage({
        // 设置文件存储位置
        destination: function (req, file, cb) {
            let date = new Date()
            let year = date.getFullYear()
            let month = (date.getMonth() + 1).toString().padStart(2, '0')
            let day = date.getDate()
            let dir = path.join(__dirname, '../public/uploads/' + year + month + day)

            // 判断目录是否存在，没有则创建
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true })
            }

            // dir就是上传文件存放的目录
            cb(null, dir)
        },
        // 设置文件名称
        filename: function (req, file, cb) {
            let fileName = Date.now() + path.extname(file.originalname)
            // fileName就是上传文件的文件名
            cb(null, fileName)
        }
    })
});

/* 根据token获取用户信息 */
function getTokenUserInfo(value, field) {
    if (value && value.user.length > 0) {
        if (field)
            return value.user[0][field];
        else
            return value.user[0];
    } else {
        return null;
    }
};

/* 将mysql OkPacket 转换为对象*/
function toOkPacket(value) {
    if (value) {
        return JSON.parse(JSON.stringify(value));
    } else {
        return null;
    }
}

/* 获取mysql受影响行数 */
function getAffectedRows(value) {
    if (value) {
        return JSON.parse(JSON.stringify(value)).affectedRows;
    } else {
        return 0;
    }
}

/* 验证数据是否为空 */
function isEmpty(value) {
    var arr = Object.keys(value);
    if (arr.length === 0)
        return true;
    else
        return false;
}

module.exports = {
    md5,
    upload,
    getTokenUserInfo,
    toOkPacket,
    getAffectedRows,
    isEmpty
}
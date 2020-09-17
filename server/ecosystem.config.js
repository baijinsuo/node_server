module.exports = {
  apps : [{
    name: 'nodeAppServe',
    script: './bin/www',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    instances: 1,
    autorestart: true,
    watch: true,
    ignore_watch: [                           // 不用监听的文件
      "node_modules",
      "logs"
    ],
    "error_file": "./logs/app-err.log",         // 错误日志文件
    "out_file": "./logs/app-out.log", 
    "log_date_format": "YYYY-MM-DD HH:mm:ss", // 给每行日志标记一个时间
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy: {
    production: {
      user: 'root',
      host: '49.233.3.220',
      ref: 'origin/master',
      repo: 'git@github.com:baijinsuo/node_server.git',
      path: '/user/local/myProject',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
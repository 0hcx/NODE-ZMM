var Config = {
    site: {
        title: 'Blog',
        description: 'Mia',
        version: '1.0',
    },
    db: {
        cookieSecret: 'frontendblog',
        name: 'blog',
        host: 'localhost',
        url: 'mongodb://127.0.0.1:27017/blog'
    }
};
module.exports = Config;
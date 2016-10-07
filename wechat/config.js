var Config = {
    site: {
        title: 'Blog',
        description: 'Mia',
        version: '1.0'
    },
    db: {
        cookieSecret: 'frontendblog',
        name: 'blog',
        host: 'localhost',
        url: 'mongodb://localhost:27017/chat'
    }
};
module.exports = Config;
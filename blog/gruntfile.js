/**
 * Created by Zoe on 2016/8/25.
 */
module.exports=function(grunt){
    //定义的任务
    grunt.initConfig({
        watch: {
            hbs: {
                files: ['views/**'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/blog/**', 'models/**/*.js', 'schemas/**/*.js', 'db/schema/**'],
                // tasks: ['jshint'],//语法检查
                options: {
                    livereload: true//文件改动重新启动
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['public/libs/**/*.js']
            },
            all: ['public/blog/*.js', 'db/*.js', 'db/schema/*.js']
        },

        nodemon: {
            dev: {
                options: {
                    file: 'app.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['./'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        //压缩配置
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    // 'public/lib/adminlte/css/AdminLTE.min.css': 'public/stylesheets/index.less'
                }
            }
        },
        uglify: {
            development: {//压缩环境
                files: {
                    'public/build/common.min.js': 'public/blog/common.js',
                    'public/build/detail.js': [
                        'public/blog/comment.js','public/blog/public/blog/initBlog.js',
                        'public/blog/login.js','public/blog/mooc.js',
                        'public/blog/moocCreateAdmin','public/blog/moocEdit.js',
                        'public/blog/newsAdmin.js','public/blog/newsListAdmin.js',
                        'public/blog/register.js'
                    ]
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    });
    //插件加载
    grunt.loadNpmTasks('grunt-contrib-watch');//只要文件添加修改就会重新执行
    grunt.loadNpmTasks('grunt-nodemon');//实时监听app.js
    grunt.loadNpmTasks('grunt-concurrent');//针对慢任务
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    grunt.option('force',true);//防止中断整个任务
    grunt.registerTask('default',['concurrent']);//默认任务
};
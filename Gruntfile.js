module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: [
            'build/*',
        ],

        sass: {
            build: {
                options: {
                    outputStyle: 'compact',
                    includePaths: require('node-bourbon').includePaths
                },
                files: {
                    // 'dest': 'src',
                    'build/main.css': 'src/main.scss',
                }
            },
        },

        copy: {
          main: {
            files: [
              // includes files within path
              {expand: true, flatten: true, src: ['src/index.html'], dest: 'build/', filter: 'isFile'},
              {expand: true, flatten: true, src: ['src/assets/*'], dest: 'build/assets', filter: 'isFile'},
            ],
          },
        },

        concat: {
            options: {
                separator: ';',
                sourceMap: true,
            },
            dist: {
                src: [
                    'src/main.js',
                    'src/dfsDrawer.js',
                ],
                dest: 'build/main.js',
            },
        },

        watch: {
            copy: {
                files: ['src/index.html'],
                tasks: ['copy']
            },
            sass: {
                files: [ '**/*.scss', '!node_modules/**', '!build/**' ],
                tasks: ['sass']
            },
            js: {
                files: ['src/**.js', '!node_modules/**', '!Gruntfile.js'],
                tasks: ['concat'],
            },
            options: {
                livereload: {
                    host: 'localhost',
                    port: 9000,
                },
            }
        },

    });

    // Load Plugins Here.
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'copy', 'sass', 'concat']);
    grunt.registerTask('js',      ['concat']);
    grunt.registerTask('dev',     ['default', 'watch']);

};

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: [
            // 'build/*',
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

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        concat: {
            options: {
                separator: ';',
                sourceMap: true,
            },
            dist: {
                src: [
                    'src/main.js',
                ],
                dest: 'build/main.js',
            },
        },

        watch: {
            sass: {
                files: [ '**/*.scss', '!node_modules/**' ],
                tasks: ['sass']
            },
            js: {
                files: ['**/*.js', '!node_modules/**', '!docs/**', '!Gruntfile.js'],
                tasks: ['concat'],
            },
            options: {
                livereload: true
            }
        },

    });

    // Load Plugins Here.
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-karma');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'sass', 'concat']);
    grunt.registerTask('js',      ['concat']);
    grunt.registerTask('watch',   ['watch']);

};

'use strict';

module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: require('./package.json'),
        watch: {
            js: {
                files: ['src/*.js', 'src/**/*.js', 'test/*.js', 'test/**/*.js'],
                tasks: ['jasmine_node']
            }
        },
        // write the task name as string, so that jshint is happy
        'jasmine_node': {
            coverage: {
                report: ['lcov'],
                savePath: 'coverage/',
                print: 'both',
                excludes: ['test/**']
            },
            options: {
                // forceExit: true,
                projectRoot: './',
                specFolders: ['test/'],
                colors: true,
                matchall: true,
                extensions: 'js',
                captureExceptions: true,
                isVerbose: true,
                junitreport: {
                    report: true,
                    savePath : './coverage/',
                    useDotNotation: true,
                    consolidate: false
                }
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            all: {
                src: ['gruntfile.js', 'src/*.js', 'src/**/*.js', 'test/*.js', 'test/**/*.js']
            }
        }
    });

    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-node-coverage');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // register tasks
    grunt.registerTask('default', ['jshint', 'jasmine_node']);
    grunt.registerTask('test', 'jasmine_node');
    grunt.registerTask('test:watch', ['jasmine_node', 'watch']);
};

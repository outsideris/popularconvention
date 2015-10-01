/*jshint node:true */ module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      front: {
        src: ['Gruntfile.js', 'public/javascripts/**/*.js']
      }
    },
    watch: {},
    mochaTest: {
      options: {
        reporter: 'spec'
      },
      all: {
        src: ['test/**/*.test.coffee']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['lint', 'test']);
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('lint', ['jshint']);
};

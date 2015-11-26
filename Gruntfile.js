/*jshint node:true */
module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      front: {
        src: ['Gruntfile.js', 'public/javascripts/**/*.js']
      },
      test: {
        src: ['test/**/*.coffee']
      }
    },
    simplemocha: {
      all: {
        src: '<%= jshint.test.src %>',
        options: {
          timeout: 4000,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'spec'
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['simplemocha']);
  grunt.registerTask('test', ['simplemocha']);
  grunt.registerTask('lint', ['jshint']);
};

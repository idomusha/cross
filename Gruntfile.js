module.exports = function(grunt) {

  /**
	 * Dynamically load npm tasks
	 */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    // Import package manifest
    pkg: grunt.file.readJSON('package.json'),

    // Banner definitions
    meta: {
      banner: '/* =================================================\n' +
      ' *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
      ' *  <%= pkg.description %>\n' +
      ' *  <%= pkg.homepage %>\n' +
      ' *\n' +
      ' *  Made by <%= pkg.author.name %>\n' +
      ' *  Under <%= pkg.license %> License\n' +
      ' * =================================================\n' +
      ' */\n',
    },

    // Concat definitions
    concat: {
      options: {
        banner: '<%= meta.banner %>',
      },
      dist: {
        src: [
          'bower_components/both/dist/both.js',
          'bower_components/threshold/dist/threshold.js',
          'src/js/cross.js'
        ],
        dest: 'dist/cross.js',
      },
    },

    /**
		 * less
		 * LESS/CSS compilation
		 * https://github.com/sindresorhus/grunt-contrib-less
		 */
    less: {
      development: {
        options: {
          compress: false,
          cleancss: false,
          ieCompact: true,
          sourceMap: true,
          strictMath: true,
        },
        src: [
          'bower_components/threshold/dist/threshold.css',
          'src/less/cross.less',
        ],
        dest: 'dist/cross.css',
      },
      production: {
        options: {
          compress: true,
          cleancss: true,
          ieCompact: true,
          sourceMap: true,
          strictMath: true,
        },
        src: [
          'bower_components/threshold/dist/threshold.css',
          'src/less/cross.less',
        ],
        dest: 'dist/cross.min.css',
      },
      demo: {
        options: {
          compress: false,
          cleancss: false,
          ieCompact: true,
          sourceMap: true,
          strictMath: true,
        },
        src: ['src/less/demo.less'],
        dest: 'dist/demo.css',
      },
    },

    /**
		 * Autoprefixer
		 * Adds vendor prefixes if need automatcily
		 * https://github.com/nDmitry/grunt-autoprefixer
		 */
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'safari 6', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
      },
      development: {
        src: 'dist/cross.css',
        dest: 'dist/cross.css',
      },
      production: {
        src: 'dist/cross.min.css',
        dest: 'dist/cross.min.css',
      },
    },

    // Minify definitions
    uglify: {
      default: {
        src: [
          'dist/cross.js'
        ],
        dest: 'dist/cross.min.js',
      },
      options: {
        banner: '<%= meta.banner %>',
      },
    },

    // watch for changes to source
    // Better than calling grunt a million times
    // (call 'grunt watch')
    watch: {
      files: ['src/**/*'],
      tasks: ['default'],
    },

  });

  grunt.registerTask('build', ['css',  'js']);
  grunt.registerTask('css', ['less:development', 'autoprefixer:development', 'less:production', 'autoprefixer:production', 'less:demo']);
  grunt.registerTask('js', ['concat', 'uglify']);
  grunt.registerTask('default', ['build']);

};

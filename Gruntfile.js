module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      gruntfile: ['Gruntfile.js'],
      scripts: ['src/**/*.js']
    },

    concat: {
      options: {
        banner: '/**\n' +
        '* Package: <%= pkg.name %> - v<%= pkg.version %> \n' +
        '* Description: <%= pkg.description %> \n' +
        '* Last build: <%= grunt.template.today("yyyy-mm-dd") %> \n' +
        '* @author <%= pkg.author %> \n' +
        '* @license <%= pkg.license %> \n'+
        '*/\n'
      },
      dist: {
        src: ['src/<%= pkg.name %>.module.js', 'src/<%= pkg.name %>.*.js'],
        dest: 'dist/<%= pkg.name %>.js',
      }
    },

    uglify: {
      options: {
        mangle: false,
        banner: '/**\n' +
        '* Package: <%= pkg.name %> - v<%= pkg.version %> \n' +
        '* Description: <%= pkg.description %> \n' +
        '* Last build: <%= grunt.template.today("yyyy-mm-dd") %> \n' +
        '* @author <%= pkg.author %> \n' +
        '* @license <%= pkg.license %> \n'+
        '*/\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      dist: {
        files: { 'dist/<%= pkg.name %>.js': ['dist/<%= pkg.name %>.js'] }
      }
    },

    watch: {
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:gruntfile']
      },
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['build'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 8080,
          open: true,
          livereload: true,
          base: {
            path: '.',
            options: {
              index: 'example/index.html'
            }
          }
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-ng-annotate');

  grunt.registerTask('default', ['connect', 'watch']);
  grunt.registerTask('build', ['jshint', 'concat', 'ngAnnotate', 'uglify']);

};

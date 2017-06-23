module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: '/**\n' +
    '* Package: <%= pkg.name %> - v<%= pkg.version %> \n' +
    '* Description: <%= pkg.description %> \n' +
    '* Last build: <%= grunt.template.today("yyyy-mm-dd") %> \n' +
    '* @author <%= pkg.author %> \n' +
    '* @license <%= pkg.license %> \n'+
    '*/\n',

    jshint: {
      gruntfile: ['Gruntfile.js'],
      scripts: ['src/**/*.js']
    },

    concat: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: ['src/<%= pkg.name %>.module.js', 'src/<%= pkg.name %>.*.js'],
        dest: 'dist/<%= pkg.name %>.js',
      }
    },

    uglify: {
      options: {
        mangle: false,
        banner: '<%= banner %>'
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
          hostname: 'localhost',
          base: {
            path: '.'
          },
          middleware: function(connect, options, middlewares) {

            var url = require('url');

            // inject a custom middleware into the array of default middlewares
            middlewares.unshift(function(req, res, next) {

              if (req.url.indexOf('/api/test/') === -1) return next();

              var value = req.url.replace('/api/test/', '');

              if( value === 'existing@mail.com' ) {
                res.writeHead(200);
                res.end('ok');
                return;
              }

              res.writeHead(200);
              res.end();

            });

            return middlewares;
          },
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

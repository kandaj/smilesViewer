
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        build: {
            dir: 'dist/'
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['env']
            },
            dist: {
                files: {
                    'dist/js/app.js': 'src/js/app.js'
                }
            }
        },
        copy: {
            main: {
                files: [
                    {   expand: true, src: ['src/css/*'], dest: '<%= build.dir %>/css', flatten: true},
                    {   expand: true, src: ['src/images/*'], dest: '<%= build.dir %>/images', flatten: true}
                ]
            }
        },
        concat: {
            main: {
                src: ['src/js/3d-model-bundle.js','dist/js/app.js'],
                dest: '<%= build.dir %>/js/bundle.js',
            }
        },
        uglify: {
            main: {
                src: '<%= concat.main.dest %>',
                dest: '<%= build.dir %>/js/bundle.min.js'
            }
        },
        htmlbuild: {
            main: {
                src: 'src/index.html',
                dest: '<%= build.dir %>/',
                options: {
                    beautify: true,
                    scripts: {
                        'app': '<%= uglify.main.dest %>'
                    }
                }
            }
        },
        minifyHtml: {
            options: {
                cdata: true
            },
            dist: {
                files: {
                    '<%= build.dir %>/index.html': '<%= build.dir %>/index.html'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-minify-html');
    grunt.registerTask('default', ['babel', 'concat', 'copy', 'uglify', 'htmlbuild', 'minifyHtml']);

};
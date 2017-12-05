# super-quick-static
serves static files... and css from sass, html from pug
<br><br>extends [quick-static](https://github.com/jniac/quick-static) ([@npm](https://www.npmjs.com/package/quick-static)) concept to allow some smart templates (sass, pug) to be served as regular files
[npm](https://www.npmjs.com/package/super-quick-static)
<br><br>use iconic fonts from [iconmonstr](https://iconmonstr.com/iconicfont/)

### install
	$ npm i -g super-quick-static

### usage
as quick-static, super-quick-static allows the following usages:	

	$ super-quick-static 
	// serve the current directory through http://localhost:8000

	$ super-quick-static ./public 12345 
	// serve the folder 'public' from the current directory on http://localhost:12345
	
	$ super-quick-static /an/absolute/path 6666 
	// serve a absolute folder on http://localhost:6666

	$ super-quick-static . 4000 auto
	// serve current directory on http://localhost:4000
	// if the port 4000 is not available, 
	// will search for the next available port

# but more importantly...

If a template file is found instead of a regular web file (pug / sass vs html / css, to begin, markdown will follow) that file will be compiled / transpiled & served on the fly. 

A reset css file is also available @ `localhost:${port}/reset.css`.
See src/reset.css to get the source, it's a mix of the famous Meyer's reset.css and Paul Irish Box-Sizing recommandation

# screenshots:

<img src="https://raw.githubusercontent.com/jniac/super-quick-static/master/src/images/terminal-screen-1.png" width="65%">
<img src="https://raw.githubusercontent.com/jniac/super-quick-static/master/src/images/chrome-screen-1.png" width="65%">
<img src="https://raw.githubusercontent.com/jniac/super-quick-static/master/src/images/chrome-screen-2.png" width="65%">

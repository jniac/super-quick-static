# super-quick-static

extends [quick-static](https://github.com/jniac/quick-static) concept to allow some smart templates (sass, pug) to be served as regular files

### install
	$ npm i super-quick-static -g

### usage
as quick-static, super-quick-static allow	

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

# but most importantly...

If a template file is found instead of a regular web file (pug / sass vs html / css, to begin) that file will be compiled / transpiled & served on the fly. 

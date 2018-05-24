# super-quick-static
**[express](https://www.npmjs.com/package/express) + [pug](https://www.npmjs.com/package/pug) + [sass](https://www.npmjs.com/package/sass)**  
serves static files... and `css` from `sass`, `html` from `pug`

extends [quick-static](https://github.com/jniac/quick-static) ([@npm](https://www.npmjs.com/package/quick-static)) concept to allow some source/template files (sass, pug) to be served as regular files  

iconic fonts from [iconmonstr](https://iconmonstr.com/iconicfont/)  
[Roboto Mono](https://fonts.google.com/specimen/Roboto+Mono) for browse pages (`src/index.pug`)


### install
	$ npm i -g super-quick-static

### usage
```shell
$ super-quick-static [path='.'] [port='8000'] [auto=true]
```
```shell
$ super-quick-static
# serve the current directory through http://localhost:8000

$ super-quick-static ./public 12345
# serve the folder 'public' from the current directory on http://localhost:12345

$ super-quick-static /an/absolute/path 6666
# serve a absolute folder on http://localhost:6666

$ super-quick-static . 4000
# serve current directory on http://localhost:4000
# if the port 4000 is not available,
# will search for the next available port (4001, 4002, ...)
```

# but more importantly...

### auto-conversion

- **sass**: `any/style.sass > any/style.css`
- **pug**: `any/template.pug > any/template.html`
- **md**: `any/note.md > any/note.html` (github flavoured style)


### reset css
A reset css file is also available @ `localhost:${port}/reset.css`.  
See src/reset.css to get the source, it's a mix of the famous Meyer's reset.css and [Paul Irish Box-Sizing recommandation](https://www.paulirish.com/2012/box-sizing-border-box-ftw/) (source `src/reset.css`).

# screenshots:

<img src="https://raw.githubusercontent.com/jniac/super-quick-static/master/src/images/terminal-screen-1.png" width="65%"/>
<img src="https://raw.githubusercontent.com/jniac/super-quick-static/master/src/images/chrome-screen-1.png" width="65%"/>

[NPM link](https://www.npmjs.com/package/super-quick-static)  

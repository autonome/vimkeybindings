# Firefox extension with a few vi(m) keybindings.

* [Install](https://addons.mozilla.org/en-US/firefox/addon/vimkeybindings/)
* [Source on Github](https://github.com/autonome/vimkeybindings)

## Supported Commands

* h : scroll left
* j : scroll down
* k : scroll up
* l : scroll right
* gg : go to the top of the page
* G (shift-g) : go to the bottom of the page
* gt : go to the next tab
* gT : go to the previous tab
* {n}gt : go to the nth tab

Commands can be repeated as in vim. Example: 50j will scroll down 50 lines.

## Credits

* Originally by the author of [this O'Reilly post](http://www.oreillynet.com/linux/blog/2006/04/firefox_with_vim_keybindings.html)
* Packaged by Arno, a commenter there
* Updated and repackaged by me on AMO
* Documented by Christopher Svec
* Rewritten from scratch with the WebExtensions API for Firefox 53 and after (and a few before) by me

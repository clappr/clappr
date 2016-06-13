### Documentation

You can find the official documentation at http://clappr.github.io/classes/Player.html

### Install

* install npm
* run `npm -g install yuidocjs`

### Generate docs

* run `yuidoc`
* mv the content from `docs` to docs repository and push it
* `cd ~/src/clappr.github.io`
* `cp -rf ../clappr/docs/* .`
* `git push`

### TODO

  * Document the main modules and classes
  * Integrate with gulp ([gulp-yuidoc](https://www.npmjs.com/package/gulp-yuidoc))
  * Make version within doc-conf.json dynamic
  * Make the process of generate docs simpler (maybe with git submodule)

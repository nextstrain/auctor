# auctor: live editing of auspice narratives (situation reports)


## About Auctor

*Definition: Author. (Poetic) the Creator.*

Auctor is a web-app which allows live, in-browser editing of nextstrain narratives


## How to run locally

I suggest using a conda environment to keep things simple.

```
conda create -n auctor nodejs=13
conda activate auctor
```

```
npm install
npm run start
```

You should now be able to see Auctor in your browser at http://localhost:4000

## Status
Early development version. Expect bugs.


## How to use

Currently you must run locally, see above for instructions.
In the future it will run on a Heroku server (or similar).

Begin by clicking the button to "load example narrative...", or drag & drop a narrative file (markdown) onto the broswer.
You will then be presented with the raw contents of the narrative slides on the left hand side of the screen, and the corresponding auspice visualisation of the currently selected slide on the right hand side.
You can edit the raw (markdown) content of each block in the editor (left hand side).
Click update and you'll see the rendering of this slide update!
When you're done you can click the button to download the (edited) narrative as a markdown file.

## To-do list

_in no particular order. Incomplete. Should be made into individual issues as needed._


#### Auspice - Auctor intergration

- The server (`run.js`) and transpilation steps (`webpack.config.js`, `babel.config.js` etc) are mainly copy-and-paste from auspice.
It may be possible to sligly refactor that code from auspice and import it here.
- Related to the above point, the server as it currently stands runs dev-mode always. It must be extended to allow production bundles to be created.
- Deploy via a heroku app, and eventually auctor.auspice.org


#### State management, internals etc

- Due to historical reasons, auspice parses a narrative into an array (`blocks`) where each block represents a narrative slide.
Auspice (as of 2.18.4) produces a html representation of the narrative-sidebar markdown for rendering, and throws away the original markdown-formatted content.
This is different to the "main-display-markdown" where it stores the markdown in the `block` and let's the rendering component transform this into HTML.
For auctor I've modified auspice to keep the (sidebar) markdown content in the `block` so that we can edit it.
This whole data flow could be refactored using the lessons learnt while developing Auctor.

- It's unclear how to handle narratives which source narratives which are not publicly available, but this will be a common use case

- We currently rely on `React` and other libraries being importable because Auspice is a npm-dep and Auspice uses them. I didn't add the libraries to `package.json` because I wanted to ensure the same version is being used consistenly. There must be a better way to do this!

- A lot of the auspice CSS isn't being imported, so the narratives don't actually render that well

- The implementation is very brittle as it currently stands

- Modifying `dataset` in the titleslide (which includes the query) breaks things

- Narratives which access multiple datasets don't yet work

- The last slide of the narrative (i.e. the last slide in the markdown) is dissapearing...

- The hostname of datasets isn't being correctly parsed / exported. See https://github.com/nextstrain/auspice/issues/890 for more context.


#### Essential editing functionality

- The UI is skeletal and needs imrovements across the board -- in other words, actually design the page, rather than just focusing on functionality!
- Changing specified dataset doesn't update the rendered narrative
- Replace the "load example" button with a dropdown selector of all listed narratives (via https://nextstrain.org/charon/getAvaiable API call)
- Get syntax highlighting working - this _should_ be happening already, so I hope it's an easy fix.
- Allow addition / removal of narrative pages
- Allow a user to start with a new / blank-template narrative
- Improved rendering of URL queries -- is there a way to allow users to view "normal nextstrain" to get these parameters?
- Ability to add a main-display-markdown section to a selected slide (or remove it if it exists!)

#### Future (nice-to-have) editing functionality

- It's common to store narratives on GitHub (both core Nextstrain narratives & Nextstrain Community narratives are sourced from GitHub). Therefore GitHub integration, e.g. using prose.io, would be great. See [nextstrain/auspice/pull/1117](https://github.com/nextstrain/auspice/pull/1117) for some background on this.
- URL state (e.g. define the narrative source in the URL)



#### Narrative-rendering functionality

The narrative-rendering needs lots of improvements. Currently we're importing the code which runs the Mobile display. We can't just use the non-mobile display components because they rely on absolute positioning and take up the entire screen. The mobile view also suffers from these problems, but is at least semi-functional. This will probably require some (slight) refactoring of the auspice client code. The mobile view is problematic as it can't (by design) display both a narrative sidebar and a mainDisplayMarkdown section.



#### Misc
- Is "auctor" acceptable as a name? 
- Logo etc
- We now have tests in auspice. Would be nice to make them part of this prototype from an early stage.
- Need to check how we sanitise input, bearing in mind we're allowing users to change the text content!

---




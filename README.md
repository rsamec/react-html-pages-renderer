# HtmlPagesRenderer

It generates html pages for document according to [PTT](https://github.com/rsamec/ptt). It renders [react components](https://facebook.github.io/react/) to HTML.

Pages are rendered in continuous sequence.


## Demo & Examples

Live demo: [rsamec.github.io/react-html-pages-renderer](http://rsamec.github.io/react-html-pages-renderer/)

To build the examples locally, run:

```
npm install
npm start
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use react-html-pages-renderer is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/react-html-pages-renderer.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install react-html-pages-renderer --save
```


## Usage



```
var HtmlPagesRenderer = require('react-html-pages-renderer');

<HtmlPagesRenderer widgets={Widgets} schema={schema}/>
```

### Properties

+	widgets - the list of widgets used for rendering
+	schema - document to print - [PTT](https://github.com/rsamec/ptt) format
+	data - data used to data bind values to schemas
+	pageOptions - height and width of the page , margin of the page, doublePage - sequence of double pages, otherwise it renders single page sequence


### Notes


## Development (`src`, `lib` and the build process)

**NOTE:** The source code for the component is in `src`. A transpiled CommonJS version (generated with Babel) is available in `lib` for use with node.js, browserify and webpack. A UMD bundle is also built to `dist`, which can be included without the need for any build system.

To build, watch and serve the examples (which will also watch the component source), run `npm start`. If you just want to watch changes to `src` and rebuild `lib`, run `npm run watch` (this is useful if you are working with `npm link`).

## License

MIT

Copyright (c) 2016 Roman Samec.


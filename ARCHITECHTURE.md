# Architecture

## Rendering

This site is built on [Preact](https://github.com/preactjs/preact), using [htm](https://github.com/developit/htm) for templating instead of JSX.

It makes use of a couple of experiments of mine.  Keep in mind my ability to name things is limited by a crippliing lack of creativity.

## Layout

This is an idea I had for imperative page definitions.  Essentially, the Layout context knows how to grab layout data from the "api" (just a stack of static JSON for now), and will pull relevant components from the server to render it.

The reason for this kind of structure is to separate semantic content from the code that renders it.  So I could, in theory, use the same content JSON for a native mobile app.

## Internationalization

This, again, is a JSON bundle.  Essentially, it's 1+N JSON files, (where N is the number of supported languages).  The first file is the list of known keys and supported languages, and the N files are the translations - essentially just an array with the same number of entries as the keys.  This is to avoid having to download the translation for languages that a user isn't going to be reading.

## css / classes

`css` is a tagged template function that accepts a blob of CSS and returns a hash of symbol -> randomizedClassName.  So you can say the following, and never have anything collide.

```javascript
const cls = `
.myComponent { display: block }
`;

/* ... */ 
return html`<div className=${cls.myComponent}></div>`;
```


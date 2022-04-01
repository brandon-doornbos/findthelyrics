# findthelyrics
NPM package to find lyrics to any given song.

[NPMJS](https://www.npmjs.com/package/@brandon-doornbos/findthelyrics) Package | [Github](https://github.com/brandon-doornbos/findthelyrics) Repo

# Disclaimer 
Although the code is not licensed, the lyrics are highly likely to be licensed by the respective record label.

To programically check the record label of the song, use [Discogs API](https://www.discogs.com/developers/).

I take no responsibility for the actions used with the code.

## How is it done?
It scrapes Genius to find the lyrics.

If the scraper fails on Genius, it falls back to MusixMatch.

## Sample Code

This code gets the lyrics of ``I Just Wanna Shine`` by ``Fitz and The Tantrums``.

```js
import * as ftl from "../dist/index.js";

var q = "Fitz and The Tantrums I Just Wanna Shine";

ftl.find(q).then((data) => {
    console.log(data);
    // [Chorus]
    // I just wanna shine like the sun when it comes up
    // Run the city from the rooftops
    // 'Cause today’s gonna be my day
    // I just wanna climb to the top of a mountain
    // Standing tall when I'm howlin'
    // ...
}).catch((error) => {
    console.error(error);
});
```
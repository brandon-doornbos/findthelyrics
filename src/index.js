var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as cheerio from "cheerio";
export function find_lyrics(query_string) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!query_string)
            return new Error("Query string required.");
        const query = encodeURI(query_string).replace(" ", "+");
        const genius_search = yield fetch("https://genius.com/api/search/song?page=1&q=" + query)
            .then((response) => { return response.json(); })
            .catch((error) => { return error.message ? error : new Error(error); });
        if (genius_search instanceof Error)
            return genius_search;
        if (genius_search.response.sections[0].hits[0]) {
            const genius_result = yield fetch("https://genius.com" + genius_search.response.sections[0].hits[0].result.path)
                .then((response) => { return response.text(); })
                .catch((error) => { return error.message ? error : new Error(error); });
            if (genius_result instanceof Error)
                return genius_result;
            const elements = cheerio.load(genius_result)("div[data-lyrics-container|=true]");
            if (elements.text()) {
                let lyrics = "";
                elements.each((_, elem) => {
                    lyrics += cheerio.load(cheerio.load(elem).html().replace(/<br>/gi, "\n")).text();
                    lyrics += "\n";
                });
                return lyrics;
            }
        }
        const musix_search = yield fetch("https://www.musixmatch.com/search/" + query)
            .then((response) => { return response.text(); })
            .catch((error) => { return error.message ? error : new Error(error); });
        if (musix_search instanceof Error)
            return musix_search;
        const musix_first_element = cheerio.load(musix_search)(".media-card-title a")[0];
        if (musix_first_element) {
            const musix_result = yield fetch("https://www.musixmatch.com" + musix_first_element.attribs.href)
                .then((response) => { return response.text(); })
                .catch((error) => { return error.message ? error : new Error(error); });
            if (musix_result instanceof Error)
                return musix_result;
            const lyrics = cheerio.load(musix_result)(".mxm-lyrics .lyrics__content__ok");
            if (lyrics)
                return lyrics.text();
        }
        return new Error(`Could not find lyrics for: "${query_string}"`);
    });
}

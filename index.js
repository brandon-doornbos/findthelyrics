import { default as got } from "got";
import * as cheerio from "cheerio";

export async function find(query_string, cb) {
    if (!query_string | !cb) {
        cb({ "message": "Callbacks and variables are required.", "code": "notAllVars" });
        return;
    }
    var q = encodeURI(query_string).replace(" ", "+");
    var url = "https://genius.com/api/search/song?page=1&q=" + q;
    got(url, {
        headers: {
            "Host": "genius.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.5",
            "X-Requested-With": "XMLHttpRequest",
            "Connection": "keep-alive",
            "Referer": "https://genius.com/search?q=" + q,
            "DNT": "1",
            "TE": "Trailers"
        }
    }).then(function (response) {
        if (JSON.parse(response.body).response.sections[0].hits[0]) {
            var data_url = "https://genius.com" + JSON.parse(response.body).response.sections[0].hits[0].result.path;
            setTimeout(function () {
                got(data_url, {
                    headers: {
                        "Host": "genius.com",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Connection": "keep-alive",
                        "Referer": "https://genius.com/search?q=" + q,
                        "DNT": "1",
                        "TE": "Trailers"
                    }
                }).then(function (response) {
                    var $ = cheerio.load(response.body);
                    if ($(".song_body-lyrics p").text()) {
                        cb(null, $(".song_body-lyrics p").text());
                    } else {
                        var mm = "https://www.musixmatch.com/search/" + q;
                        got(mm, {
                            headers: {
                                "Host": "www.musixmatch.com",
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0",
                                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                                "Accept-Language": "en-US,en;q=0.5",
                                "Accept-Encoding": "gzip, deflate, br",
                                "Referer": "https://www.musixmatch.com/",
                                "Connection": "keep-alive",
                                "Upgrade-Insecure-Requests": "1",
                                "DNT": "1",
                                "Cache-Control": "max-age=0"
                            }
                        }).then(function (response) {
                            var $ = cheerio.load(response.body);
                            if (!$(".media-card-title a")[0]) {
                                cb({ code: "noData", message: "There was no data available for your query.", suggestion: "Make sure you spelled the query correctly." }, null);
                                return;
                            }
                            var mm2 = "https://www.musixmatch.com" + $(".media-card-title a")[0].attribs.href;
                            got(mm2, {
                                headers: {
                                    "Host": "www.musixmatch.com",
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0",
                                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                                    "Accept-Language": "en-US,en;q=0.5",
                                    "Accept-Encoding": "gzip, deflate, br",
                                    "Referer": mm,
                                    "Connection": "keep-alive",
                                    "Upgrade-Insecure-Requests": "1",
                                    "DNT": "1",
                                    "Cache-Control": "max-age=0",
                                    "TE": "Trailers"
                                }
                            }).then(function (response) {
                                var $ = cheerio.load(response.body);
                                if ($(".mxm-lyrics .lyrics__content__ok")) {
                                    var lyrics = $(".mxm-lyrics .lyrics__content__ok").text();
                                    cb(null, lyrics)
                                } else {
                                    cb({ code: "noData", message: "There was no data available for your query.", suggestion: "Make sure you spelled the query correctly." }, null);
                                }
                            })
                        }).catch(function (e) {
                            cb(e, null)
                        })
                    }
                }).catch(function (e) {
                    cb(e, null)
                })
            }, 1500);
        } else {
            var d = "https://www.musixmatch.com/search/" + q
            got(d, {
                headers: {
                    "Host": "www.musixmatch.com",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Referer": "https://www.musixmatch.com/",
                    "Connection": "keep-alive",
                    "Upgrade-Insecure-Requests": "1",
                    "DNT": "1",
                    "Cache-Control": "max-age=0"
                }
            }).then(function (response) {
                var $ = cheerio.load(response.body);
                if (!$(".media-card-title a")[0].attribs.href) {
                    cb({ code: "noResults", message: "There was no results for your query.", suggestion: "Make sure you spelled the query correctly." }, null);
                    return;
                }
                var mm2 = "https://www.musixmatch.com" + $(".media-card-title a")[0].attribs.href;
                got(mm2, {
                    headers: {
                        "Host": "www.musixmatch.com",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Referer": d,
                        "Connection": "keep-alive",
                        "Upgrade-Insecure-Requests": "1",
                        "DNT": "1",
                        "Cache-Control": "max-age=0",
                        "TE": "Trailers"
                    }
                }).then(function (response) {
                    var $ = cheerio.load(response.body);
                    if ($(".mxm-lyrics .lyrics__content__ok")) {
                        var lyrics = $(".mxm-lyrics .lyrics__content__ok").text();
                        cb(null, lyrics)
                    } else {
                        cb({ code: "noData", message: "There was no data available for your query.", suggestion: "Make sure you spelled the query correctly." }, null);
                    }
                })
            }).catch(function (e) {
                cb(e, null)
            })
        }
    })
}

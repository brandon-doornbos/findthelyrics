const ftl = require("../");

var q = "Fitz and The Tantrums I Just Wanna Shine";

ftl.find(q, function (err, resp) {
    if (!err) {
        console.log(resp)
    } else {
        console.log(err)
    }
    // [Chorus]
    // I just wanna shine like the sun when it comes up
    // Run the city from the rooftops
    // 'Cause today’s gonna be my day
    // I just wanna climb to the top of a mountain
    // Standing tall when I'm howlin'
    // ...
})

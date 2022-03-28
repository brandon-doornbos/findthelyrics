import * as ftl from "../index.js";

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

var fs = require("fs");

var data = fs.readFileSync("./data/transform/director-actor-2.txt");
var acesGoPlaces = JSON.parse(data.toString());

for (var year in acesGoPlaces) {
    console.log(year);
    let count = 0;
    let pairs = acesGoPlaces[year];
    var result = Object.keys(pairs).map((key) => {
        count += pairs[key].length;
        return [key, pairs[key]]
    });
    result.sort((a, b) => {
        return b[1].length - a[1].length;
    });
    
    result.splice(0, 30).forEach((value, i) => {
        console.log(i, value[0], value[1].length);
    });

    console.log("total film", count);
    console.log("======");
}

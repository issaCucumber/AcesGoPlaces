var fs = require("fs");

var acesGoPlaces = {};
var data = fs.readFileSync("./data/transform/file.txt");

var clean_name = (name) => {
    name = name.replace("（", "(");
    name = name.replace("）", ")");
    let parts = name.match(/\([0-9a-z ]{0,}[^\u0000-\u007F]{1,}\)/ig);
    if(parts != null) {
        parts.forEach((pattern) => {
            name = name.replace(pattern, "");
        });
    }

    return name;
}

data.toString().split("\n").forEach((line, i) => {
    console.log("line", i);

    if(line == "") {
        return;
    }

    var film = JSON.parse(line);
    var directorStr = film["導演"];
    var actorsStr = film["主要演員"];
    var yearStr = film["首映日期"];

    if(!directorStr || !actorsStr || !yearStr){
        return;
    }

    var year = yearStr.match(/[0-9]{4}/ig);

    if(year == null) {
        return;
    }

    year = Math.floor(parseInt(year[0]) / 10) * 10;
    var name = film["中文片名"];

    var directors = directorStr.split(/[/、,]+/);
    var actors = actorsStr.split(/[/、,]+/);

    directors.forEach((director) => {
        director = clean_name(director);
        actors.forEach((actor) => {
            actor = clean_name(actor);
            var key = [director.trim(), actor.trim()].join("|||");
    
            if(!acesGoPlaces[year]){
                acesGoPlaces[year] = {};
            }
    
            if(!acesGoPlaces[year][key]) {
                acesGoPlaces[year][key] = [{"year":yearStr, "name":name}];
            } else {
                var old = acesGoPlaces[year][key];
                old.push({"year":yearStr, "name":name});
                acesGoPlaces[year][key] = old;
            }
    
        });
    });
    
});

fs.writeFileSync("./data/transform/director-actor-2.txt", JSON.stringify(acesGoPlaces));

var fs = require('fs');
var refxguide = {
    3.259: "中文片名", 
    7.339: "英文片名", 
    11.179: "首映日期", 
    14.014: "語別", 
    16.512: "出品公司", 
    20.494: "監製",
    23.209: "製片",
    25.849: "導演",
    28.369: "編劇",
    30.889: "原著",
    33.409: "攝影",
    35.255: "主要演員",
    45.837: "附註"
};

var currentxguide = {};
var find_col_index = (x) => {
    var diff = null;
    var _x = null;
    for (var key in refxguide) {
        var k = Math.abs(key - x);
        if(diff == null || k < diff) {
            diff = k;
            _x = key;
        }
    }

    currentxguide[x] = refxguide[_x];
    return refxguide[_x];
};

var folder = "./data/raw";

var cleanText = (text) => {
    var clean = text;
    for (var key in refxguide) {
        clean = clean.replace(refxguide[key], "");
    }

    return clean;
};

var transform = (file) => {

    var data = fs.readFileSync(file);
    data.toString().split("\n").forEach((line, i) => {
        if(line == null || line == "") {
            return;
        }
  
        var array = JSON.parse(line);
        var map = new Map();
        array.forEach((item) => {
            if(!item.text || item.text == "") {
              return;
            }
  
            var index = (currentxguide[item.x]) ? currentxguide[item.x] : find_col_index(item.x);
  
            var cleantext = cleanText(item.text);
            if(map.has(index)) {
              map.get(index).push(cleantext);
            } else {
              map.set(index, [cleantext]);
            }
  
        });
  
        writeToFile(map);
    });
    
};

var writeToFile = (map) => {
    var line = {};
    map.forEach((value, key) => {
        if(key == "英文片名") {
            line[key] = value.join(" ");
        } else {
            line[key] = value.join("");
        }
    });

    fs.appendFileSync("./data/transform/file.txt", JSON.stringify(line) +"\r\n")
};

fs.readdirSync(folder).forEach(function (subfolder) {

    if(subfolder.match(".DS_") == null) {
        let x = [folder,subfolder].join("/");
        console.log("looking at", x);
        fs.readdirSync(x).forEach(function (dirContent) {
            if(dirContent.match(".txt") != null) {
                let y = [folder,subfolder,dirContent].join("/");
                console.log("transforming", y);
                transform(y);
            }
        });
    }

});
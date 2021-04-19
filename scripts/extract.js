var pdfreader = require("pdfreader");
var fs = require("fs");

var current = 3277;
var current_digit = 4;
var current_movie = [];
var current_page = 1;
var start_page = 187;
var batch = 4;

new pdfreader.PdfReader().parseFileItems('./data/7-2-1-unlocked.pdf', function (err, item) {
  if (!item || item.page) {
    // end of file, or page
    // console.log(renderMatrix(table.getMatrix()));
    console.log("PAGE:", item.page);
    current_page = item.page;
    // table = new pdfreader.TableParser(); // new/clear table for next page
  } else if (item.text) {
    // accumulate text items into rows object, per line

    if(current_page < start_page) {
      return;
    }

    var text = item.text;

    var search = "[0-9]{" + current_digit + "}";
    const regex = new RegExp(search, "ig");

    var n = text.match(regex);

    if(n != null && parseInt(n[0]) == current) {
      if(current_movie.length > 0) {
        // write to file
        fs.appendFileSync("./data/pages-" + batch + "/film-data-" + current_page + ".txt", JSON.stringify(current_movie) +"\r\n");
      }

      current_movie = [];
      current_movie.push({text: text.replace(n.join(""), ""), x: item.x, y: item.y});

      current++;
      var i = (current + "").split("");
      current_digit = i.length;

    } else if(current_movie.length > 0) {
      current_movie.push({text: item.text, x: item.x, y: item.y});
    }
  }
});
const path = require("path");
const fs = require("fs");

const input = document.getElementById("input");
const splitBtn = document.getElementById("separate");
const countInput = document.getElementById("count");

let splitBy = 30000;

countInput.addEventListener("change", ({ target: { value } }) => {
  if (value.match(/^\d+$/)) {
    splitBy = value;
  }
});

splitBtn.addEventListener("click", () => {
  const file = input.files[0];

  if (path.extname(file.path) !== ".csv") {
    return;
  }

  splitFile(file.path);
});

function splitFile(filePath) {
  fs.readFile(filePath, "utf-8", (err, data) => {
    const splited = data.split(/\n/);

    let from = 0;

    while (splited.length !== 0) {
      const lineArray = splited.splice(0, splitBy);

      const to = from + lineArray.length;

      const newFileData = lineArray.join("\n");

      if (!fs.existsSync("./result")) {
        fs.mkdirSync("./result");
      }

      fs.writeFile(
        path.join(__dirname + `/result/${from}-${to - 1}.csv`),
        newFileData,
        err => {
          if (err) throw err;
        }
      );

      from = to;
    }
  });
}

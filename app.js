const express = require("express");
const dayjs = require("dayjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const mathjs = require("mathjs");
const app = express();
const fs = require("fs");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

const ROWS_PER_SECOND = 64;
const NUM_OF_CHANNELS = 16;
const NUM_OF_TEST_CASES = 3;

function getEegCase(math, seconds) {
  return {
    envelope: math.random([Math.round(seconds * ROWS_PER_SECOND), 1]),
    eeg: math.random([Math.round(seconds * ROWS_PER_SECOND), NUM_OF_CHANNELS])
  };
}

app.get("/eeg-data/:seconds", (req, res) => {
  const math = mathjs.create(mathjs.all, {
    randomSeed: "eeg"
  });
  const seconds = parseInt(req.params.seconds);
  const testCases = [];

  for (let i = 0; i < NUM_OF_TEST_CASES; i += 1) {
    testCases.push(getEegCase(math, seconds));
  }

  res.send(testCases);
});

app.post("/results/:tag/:seconds", (req, res) => {
  const now = dayjs();
  const { tag, seconds } = req.params;
  const fileName = `./results/${seconds}_${tag}_${now.format(
    "YYYY-MM-DD-HH_mm_ss"
  )}.json`;
  fs.writeFile(fileName, JSON.stringify(req.body), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log(`File ${fileName} was saved`);
    res.sendStatus(200);
  });
});

app.listen(port, () =>
  console.log(`The EEG data app is listening on port ${port}!`)
);

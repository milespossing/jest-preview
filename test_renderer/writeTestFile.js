const fs = require("fs");
const { values, omit } = require("lodash");

const outputPath = "__testoutput__";

const cleanPath = (dirtyString) =>
  dirtyString.replace(/[\/\\|&;$%@"<>()+.,:]/g, "");

const getOutputPath = (fileName) => 
      outputPath + "\\" + cleanPath(fileName);

const writeTestFile = async (testFileName, testData) => {
  if (!fs.existsSync(outputPath)) fs.mkdir(outputPath, err => err && console.error(err));
  const fileData = values(testData).map((testResult) => ({
    testFileName,
    ...testResult,
  }));
  fileData.forEach((test) => {
    const fileName = `${test.testFileName}.${test.testName}`;
    const htmlFile = test.finalBody;
    const jsonFile = {
      ...omit(test, "finalBody"),
      finalHtml: fileName + ".html",
    };
    fs.writeFile(
      getOutputPath(fileName) + ".json",
      JSON.stringify(jsonFile),
      (err) => err && console.log(err)
    );
    fs.writeFile(
      getOutputPath(fileName) + ".html",
      JSON.stringify(htmlFile),
      (err) => err && console.log(err)
    );
  });
};

module.exports = writeTestFile;

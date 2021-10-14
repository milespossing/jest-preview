const fs = require("fs");
const { values, omit } = require("lodash");

const outputPath = "__testoutput__";

const cleanPath = (dirtyString) =>
  dirtyString.replace(/[\/\\|&;$%@"<>()+.,:]/g, "");

const getOutputPath = (fileName) => 
      outputPath + "\\" + cleanPath(fileName);

const writeTestFile = async (testFileName, testData) => {
  if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);
  const fileData = values(testData).map((testResult) => ({
    testFileName,
    ...testResult,
  }));
  fileData.forEach((test) => {
    const fileName = `${test.testFileName}.${test.testName}`;
    const htmlFile = test.finalBody;
    const jsonFile = {
      ...omit(test, "finalBody"),
      finalHtml: getOutputPath(fileName) + ".html",
    };
    fs.writeFileSync(getOutputPath(fileName) + ".json", JSON.stringify(jsonFile));
    fs.writeFileSync(getOutputPath(fileName) + ".html", htmlFile);
  });
};

module.exports = writeTestFile;

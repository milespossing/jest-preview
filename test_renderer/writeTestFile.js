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
    const jsonFile = {
      ...omit(test, ["finalBody", 'doms']),
      files: [],
    };

    test.doms.forEach((domHTML, index) => {
      const fileName = `${test.testFileName}.${test.testName}.${index}`;
      const htmlFile = domHTML;

      jsonFile.files.push(fileName);

      fs.writeFileSync(getOutputPath(fileName) + ".html", htmlFile);
    });


    fs.writeFileSync(getOutputPath(fileName) + ".json", JSON.stringify(jsonFile));
  });
};

module.exports = writeTestFile;

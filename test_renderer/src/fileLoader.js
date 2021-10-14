const fs = require("fs");

const getMoveFileName = (source, dest) =>
  dest + "\\" + source.split("\\").pop();

const getPublicFileName = (source, dest) => 
  getMoveFileName(source, dest).split('public\\').pop();

const buildMasterFile = (testData, dest) => {
  return {
    masterFile: testData.map((data) => ({
      name: data.testName,
      sourceFileName: data.testFileName,
      renderFileName: data.files.map(filename => getPublicFileName(filename, dest)),
      result: data.result,
    })),
  };
};

const loadFiles = (sourceDir, destDir) => {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);
  if (!fs.existsSync(destDir + '\\testFiles')) fs.mkdirSync(destDir + '\\testFiles');

  const jsonFiles = fs
    .readdirSync(sourceDir)
    .filter((f) => f.match(/.+\.json$/));
  const testData = jsonFiles
    .map((f) => sourceDir + "/" + f)
    .map((f) => JSON.parse(fs.readFileSync(f)));
  testData
    .forEach((testData) => {
      testData.files.forEach(filename => {
        fs.copyFileSync(filename, getMoveFileName(filename, destDir + '\\testFiles'))
      })
    });

// console.log('testData', JSON.stringify(testData, null, 2));

  const masterFile = JSON.stringify(buildMasterFile(testData, destDir + '\\testFiles'));
  fs.writeFileSync(destDir + "/" + 'master.json', masterFile);
};

module.exports = loadFiles;

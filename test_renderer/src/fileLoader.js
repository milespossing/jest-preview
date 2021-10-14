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
      renderFileName: [getPublicFileName(data.finalHtml, dest)],
      result: data.result,
    })),
  };
};

const loadFiles = (sourceDir, destDir) => {
  console.log(sourceDir, destDir);
  const printMap = (o) => {
    console.log(o);
    return o;
  };
  const jsonFiles = fs
    .readdirSync(sourceDir)
    .filter((f) => f.match(/.+\.json$/));
  const testData = jsonFiles
    .map((f) => sourceDir + "/" + f)
    .map((f) => JSON.parse(fs.readFileSync(f)))
    .map(printMap);
  testData
    .map((data) => data.finalHtml)
    .map(printMap)
    .forEach((n) => fs.copyFileSync(n, getMoveFileName(n, destDir + '\\testFiles')));
  const masterFile = JSON.stringify(buildMasterFile(testData, destDir + '\\testFiles'));
  fs.writeFileSync(destDir + "/" + 'master.json', masterFile);
};

module.exports = loadFiles;

const fs = require("fs");
const util = require("util")
const hasha = require("hasha");

module.exports = async (filePath) => {
  const readFile = util.promisify(fs.readFile)
  const fileContent = await readFile(filePath);

  return hasha.async(fileContent);
};

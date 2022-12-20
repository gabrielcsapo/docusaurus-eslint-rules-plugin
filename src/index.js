const path = require("path");
const fs = require("fs");

module.exports = function (context, options) {
  return {
    name: "docusaurus-plugin-eslint-rules",

    getThemePath() {
      return path.resolve(__dirname, "./theme");
    },

    async contentLoaded({ content, actions }) {
      const { rulePath, linkPath } = options;
      const { setGlobalData } = actions;

      if (!rulePath) {
        throw new Error("please specify a rulePath");
      }

      const rules = fs
        .readdirSync(rulePath)
        .filter((file) => path.extname(file) === ".js")
        .map((file) => path.basename(file, ".js"))
        .map((fileName) => [fileName, require(path.join(rulePath, fileName))]);

      const categories = rules
        .map((entry) => {
          return entry[1]?.meta?.docs.category;
        })
        .filter((category) => {
          return category !== undefined;
        })
        .reduce((arr, category) => {
          if (!arr.includes(category)) {
            arr.push(category);
          }
          return arr;
        }, [])
        .sort(function (a, b) {
          return a.toLowerCase().localeCompare(b.toLowerCase()); // Case-insensitive sort function.
        });

      setGlobalData({ rules, categories, linkPath });
    },
  };
};

const babelOptions = {
  presets: ["@babel/env", "@babel/react"]
};

// eslint-disable-next-line import/no-extraneous-dependencies
module.exports = require("babel-jest").createTransformer(babelOptions);

module.exports = {
  transform: {
    "^.+\\.jsx?$": "<rootDir>/jest-preprocess.js"
  },
  automock: false,
  modulePaths: ["src"],
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": "identity-obj-proxy",
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ico)$":
      "<rootDir>/__mocks__/fileMock.js"
  },
  testPathIgnorePatterns: ["node_modules", ".cache"],
  globals: {
    __PATH_PREFIX__: ""
  },
  testURL: "http://localhost"
};

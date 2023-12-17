const info = (...params) => {
  console.log('\x1b[36m%s\x1b[0m', ...params);
};

const error = (...params) => {
  console.log('\x1b[31m%s\x1b[0m', ...params);
};

module.exports = { info, error };

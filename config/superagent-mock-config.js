// ./superagent-mock-config.js file
module.exports = [
  {
    /**
     * regular expression of URL
     */
    pattern: 'https://api.github.com/(\\w+)/',

    fixtures: './fixtures/category.js',
    /**
     * returns the result of the request
     *
     * @param match array Result of the resolution of the regular expression
     * @param data  mixed Data returns by `fixtures` attribute
     */
    callback: function (match, data) {
      console.log(data);
      return {
        body: data
      };
    }
  }
];
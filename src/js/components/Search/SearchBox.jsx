import React from 'react';
import algoliasearch from'algoliasearch';
import Autosuggest from 'react-autosuggest';
import config from '../../../../config/';
import classSet from 'classnames';

if (process.env.BROWSER) {
  require('./SearchBox.less');
}
class SearchBox extends React.Component {

  state = {
    hasFocus: false
  };

  constructor(props) {
    super(props);
    this.client = algoliasearch(config.algolia.appId, config.algolia.apiKey);
    this.movies = this.client.initIndex('movies');
    this.series = this.client.initIndex('series');
    this.hasFocus = false;
  }

  getOptions(value, done) {
    this.movies.search(value, function (err, content) {
      if (err) return done([]);
      done(null, content.hits)
    });
  }

  escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  focusLink(hasFocus) {
    this.setState({hasFocus: hasFocus});
  }

  renderSuggestion(suggestionObj) {
    return (
      <small>{ suggestionObj.title}</small>
    );
  }

  render() {

    const inputAttributes = {
      placeholder: 'Rechercher...',
      type: 'search',
      onFocus: event => this.focusLink(true),
      onBlur: event => this.focusLink(false)
    };

    let fielClass = {
      'has-focus': this.state.hasFocus
    };

    return (
      <div className="search-box">
        <form className="search-form">
          <fieldset className={classSet(fielClass)}>
            <Autosuggest
              name="search-box"
              value="one"
              placeholder="Rechercher"
              suggestions={::this.getOptions}
              inputAttributes={inputAttributes}
              suggestionRenderer={::this.renderSuggestion}
              />
          </fieldset>
        </form>
      </div>
    );
  }
}

export default SearchBox;

import React ,{ PropTypes } from 'react';
import algoliasearch from'algoliasearch';
import Autosuggest from 'react-autosuggest';
import config from '../../../../config/';
import classSet from 'classnames';

if (process.env.BROWSER) {
  require('./SearchBox.less');
}
class SearchBox extends React.Component {

  static contextTypes = {
    history: PropTypes.object.isRequired
  };

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

  getSuggestionValue(suggestionObj) {
    return suggestionObj.title;
  }

  onSuggestionSelected(suggestionObj, event) {
    event.preventDefault();
    console.log(suggestionObj);
    let link = `/${suggestionObj._id}/${suggestionObj.slug}`;
    this.context.history.pushState(null,link)
  }

  renderSuggestion(suggestionObj) {

    let imageStyles = '';
    let thumb = suggestionObj.thumb;
    if (thumb) {
      let imgix = thumb.imgix;
      imageStyles = imgix;
    }

    return (
      <div className="row">
        <div className="col-md-4">
          <img className="img-responsive" alt={suggestionObj.title}
               src={`${imageStyles}?fit=crop&w=60&h=40&q=30`}/>
        </div>
        <div className="col-md-8 text-left">
          <small>{ suggestionObj.title}</small>
        </div>
      </div>
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
              onSuggestionSelected={::this.onSuggestionSelected}
              suggestionValue={::this.getSuggestionValue}
              />
          </fieldset>
        </form>
      </div>
    );
  }
}

export default SearchBox;

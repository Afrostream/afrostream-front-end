import React from 'react';
import algoliasearch from'algoliasearch';

if (process.env.BROWSER) {
  require('./SearchBox.less');
}
class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    const client = algoliasearch(config.algolia.appId, config.algolia.apiKey);
  }

  render() {

    const client = algoliasearch('applicationID', 'apiKey');
    var index = client.initIndex('indexName');
    index.search('something', function searchDone(err, content) {
      console.log(err, content);
    });

    return (
      <div className="search-box">
        <form className="search-form">
          <fieldset>
            <input type="search" className="search fa fa-search" placeholder="Rechercher"/>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default SearchBox;

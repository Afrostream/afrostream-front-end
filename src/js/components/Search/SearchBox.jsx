import React from 'react';
if (process.env.BROWSER) {
  require('./SearchBox.less');
}
class SearchBox extends React.Component {

  render() {
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

import React from 'react';
if (process.env.BROWSER) {
  require('./SearchBox.less');
}
class SearchBox extends React.Component {

  render() {
    return (
      <div className="search-box">
        <form className="pure-form">
          <fieldset>
            <input type="search" placeholder="RECHERCHEZ"/>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default SearchBox;

import React ,{ PropTypes } from 'react';
import ReactDOM from'react-dom';
import { connect } from 'react-redux';
import config from '../../../../config/';
import classSet from 'classnames';
import { Link } from 'react-router';
import * as SearchActionCreators from '../../actions/search';

if (process.env.BROWSER) {
  require('./SearchBox.less');
}

@connect(({ Search }) => ({Search}))
class SearchBox extends React.Component {

  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  debounceSearch = _.debounce(this.search, 400);

  getInput() {
    return ReactDOM.findDOMNode(this.refs.inputSearchMini);
  }

  componentDidMount() {
    var input = this.getInput();

    // Set input to last search
    if (this.props.lastSearch) {
      input.value = this.props.lastSearch;
    }
  }

  search() {
    const {
      props: { dispatch }
      } = this;
    let self = this;
    let input = this.getInput().value;

    if (input.length < 3) {
      return;
    }

    this.setState({
      fetching: true
    });
    this.context.history.pushState(null, 'recherche');
    dispatch(SearchActionCreators.fetchMovies(input)).then(function () {
      self.setState({
        fetching: false
      });
    });
  }

  render() {

    return (
      <div className="search-box">
        <input
          onChange={::this.debounceSearch}
          name="search-box"
          type="text"
          ref="inputSearchMini"
        />
      </div>
    );
  }
}

export default SearchBox;

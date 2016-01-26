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

  constructor(props) {
    super(props);
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  state = {
    hasFocus: false
  };

  debounceSearch = _.debounce(this.search, 400);

  handleFocus() {
    this.setState({
      hasFocus: true
    })
  }

  handleBlur() {
    let self = this;
    setTimeout(function () {
      self.setState({
        hasFocus: false
      })
    }, 200);
  }

  getInput() {
    return ReactDOM.findDOMNode(this.refs.inputSearchMini);
  }

  goBack() {
    let input = this.getInput();
    input.value = '';
    this.context.history.goBack();
  }

  componentDidMount() {
    let input = this.getInput();

    // Set input to last search
    if (this.props.lastSearch) {
      input.value = this.props.lastSearch;
    }
  }

  search() {
    const {
      props: { dispatch }
      } = this;
    let input = this.getInput().value;

    if (input.length < 3) {
      return;
    }

    this.context.history.pushState(null, 'recherche');
    dispatch(SearchActionCreators.fetchMovies(input));
  }

  render() {


    let fielClass = {
      'search-box': true,
      'has-focus': this.state.hasFocus
    };

    return (
      <div className={classSet(fielClass)}>
        <i className="fa fa-times" onClick={::this.goBack} />
        <input
          onChange={::this.debounceSearch}
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
          name="search-box"
          type="text"
          ref="inputSearchMini"
        />
      </div>
    );
  }
}

export default SearchBox;

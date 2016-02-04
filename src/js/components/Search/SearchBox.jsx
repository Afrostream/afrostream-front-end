import React ,{ PropTypes } from 'react';
import ReactDOM from'react-dom';
import { connect } from 'react-redux';
import config from '../../../../config/';
import classSet from 'classnames';
import { Link } from 'react-router';

import * as EventActionCreators from '../../actions/event';

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
    const {
      props: { dispatch }
      } = this;

    dispatch(EventActionCreators.pinHeader(true));
    this.setState({
      hasFocus: true
    })
  }

  handleBlur() {
    let self = this;
    setTimeout(function () {
      let input = self.getInput();
      input.value = '';
      self.setState({
        hasFocus: false
      });
    }, 200);
  }

  getInput() {
    return ReactDOM.findDOMNode(this.refs.inputSearchMini);
  }

  goBack() {
    let input = this.getInput();
    input.value = '';
    let isInSearch = this.context.history.isActive('recherche');
    this.handleBlur();
    if (isInSearch) {
      this.context.history.pushState(null, '/');
    }
  }

  componentDidMount() {
    let input = this.getInput();

    // Set input to last search
    if (this.props.lastSearch) {
      input.value = this.props.lastSearch;
    }
  }

  search() {
    let input = this.getInput().value;
    if (input.length < 3) {
      return;
    }
    this.context.history.pushState(null, '/recherche', {search: input});
  }

  render() {

    let fielClass = {
      'search-box': true,
      'has-focus': this.context.history.isActive('recherche') || this.state.hasFocus
    };

    return (
      <div className={classSet(fielClass)}>
        <i className="fa fa-times" onClick={::this.goBack}/>
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

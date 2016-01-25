'use strict';
import React from 'react';
import ReactDOM from'react-dom';
import { connect } from 'react-redux';
import * as SearchActionCreators from '../../actions/search';
import Thumb from '../../components/Movies/Thumb';
import Spinner from '../Spinner/Spinner';
import {search} from '../../../../config';

if (process.env.BROWSER) {
  require('./SearchPage.less');
}

@connect(({ Search }) => ({Search}))
class SearchPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      fetching: false
    };
  }

  componentDidMount() {
    var input = this.getInput();

    // Set input to last search
    if (this.props.lastSearch) {
      input.value = this.props.lastSearch;
    }

    /**
     * Wait until the end of transition is complex (we have to use ReactTransition)
     * So for now we use this dirty hack
     */
    setTimeout(() => {
      input.focus();
    }, 800);
  }

  debounceSearch = _.debounce(this.search, 400);

  getInput() {
    return ReactDOM.findDOMNode(this.refs.inputSearch);
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

    dispatch(SearchActionCreators.fetchMovies(input)).then(function () {
      self.setState({
        fetching: false
      });
    });
  }

  renderMovies(movies) {
    if (!movies || !movies.size) {
      return this.state.fetching ? '' : search.dict['noData'];
    }
    return movies.map((movie, i) => <Thumb showImage={true}
                                           key={`search-movie-${movie.get('_id')}-${i}`} {...{movie}}/>).toJS();
  }

  render() {
    const {
      props: { Search}
      } = this;

    const moviesFetched = Search.get(`search`);

    let hits;
    let movies;
    if (moviesFetched) {
      hits = moviesFetched.get('hits');
      movies = this.renderMovies(hits);
    }

    return (
      <ReactCSSTransitionGroup transitionName="search" className="row-fluid search-page" transitionEnterTimeout={300}
                               transitionLeaveTimeout={300} component="div">
        <div className="big-search">
          <input
            type="text"
            ref="inputSearch"
            className="big-search__field"
            placeholder="Rechercher"
            onChange={::this.debounceSearch}/>
        </div>
        <div className="search-result">
          {this.state.fetching ? <div className="spinner-search"><Spinner /></div> : ''}
          {movies}
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}

export default SearchPage;

import React, { PropTypes }  from 'react';
import { connect } from 'react-redux';
import { prepareRoute,analytics } from '../decorators';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import WelcomePage from './Welcome/WelcomePage';
import BrowsePage from './Browse/BrowsePage';
import PaymentPage from './Payment/PaymentPage';
import PaymentSuccess from './Payment/PaymentSuccess';
import Spinner from './Spinner/Spinner';
import * as EventActionCreators from '../actions/event';
import * as MovieActionCreators from '../actions/movie';
import * as CategoryActionCreators from '../actions/category';

@prepareRoute(async function ({ store, router, params: { movieId } }) {
  return await * [
    store.dispatch(EventActionCreators.pinHeader(false)),
    store.dispatch(MovieActionCreators.getMovie(movieId)),
    store.dispatch(CategoryActionCreators.getAllSpots()),
    store.dispatch(CategoryActionCreators.getMenu()),
    store.dispatch(CategoryActionCreators.getMeaList())
  ];
})
@connect(({ User }) => ({User}))
class HomePage extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  render() {
    const { props: { User ,children} } = this;
    const token = User.get('token');
    const pending = User.get('pending');
    const user = User.get('user');
    let isPending = Boolean(token || pending);
    if (user) {
      if (children) {
        return children;
      }
      else {
        return (<BrowsePage/>)
      }
    } else {
      return (<WelcomePage spinner={isPending}/>);
    }
  }
}

export default HomePage;

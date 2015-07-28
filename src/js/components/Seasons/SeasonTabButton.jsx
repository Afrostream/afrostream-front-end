import React from 'react';
import { connect } from 'react-redux';
import classSet from 'classnames';
import * as SeasonActionCreators from '../../actions/season';

@connect(({ Season }) => ({Season})) class SeasonTabButton extends React.Component {

  static propTypes = {
    index: React.PropTypes.number.isRequired
  };

  render() {
    const {
      props: {
        active,index
        }
      } = this;

    const classes = classSet({
      'season': true,
      'season--active': active
    });

    return (
      <span className={classes} onClick={::this.toggleSeason}>SAISON {index + 1}</span>
    );
  }

  toggleSeason() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(SeasonActionCreators.toggleSeason(this.props.index));
  }
}

export default SeasonTabButton;

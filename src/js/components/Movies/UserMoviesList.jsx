import React from 'react'
import { connect } from 'react-redux'
import GoBack from '../GoBack/GoBack'
import _ from 'lodash'
import { withRouter } from 'react-router'
import MoviesSlider from './MoviesSlider'
import {
  intlShape,
  injectIntl
} from 'react-intl'
import { I18n } from '../Utils'

if (process.env.BROWSER) {
  require('./UserMoviesList.less')
}

@connect(({User}) => ({User}))
class UserMoviesList extends I18n {

  constructor (props) {
    super(props)
  }

  render () {
    const {
      props: {
        User,
        axis,
        label,
        rowHeight,
        router,
        routes,
        thumbW,
        thumbH
      }
    } = this

    const historyList = User.get('history')
    if (!historyList) {
      return (<div />)
    }
    const dataList = this.props.limit && historyList.take(this.props.limit) || historyList
    const slug = 'history'
    const showTitle = true
    const showDescription = false
    const share = false
    const favorite = false
    const load = false
    const type = 'episode'
    const inHistoryPage = router.isActive('history') || _.find(routes, route => ( route.name === 'history'))
    return (
      <div className="user-movie-history">
        {dataList && !dataList.size && inHistoryPage &&
        <div className="row text-center"><h2>{this.getTitle('history.noData')}</h2><GoBack /></div>}
        <MoviesSlider
          {...this.props}
          columnMaxWidth={thumbW}
          className="user-movie-history_list movies-data-list"
          key={`user-movie-history`} {...{
          dataList,
          label,
          slug,
          showTitle,
          showDescription,
          type,
          thumbW,
          thumbH,
          load,
          share,
          axis,
          favorite,
          rowHeight
        }} />
      </div>
    )
  }
}

UserMoviesList.propTypes = {
  intl: intlShape.isRequired,
  thumbW: React.PropTypes.number,
  thumbH: React.PropTypes.number,
  rowHeight: React.PropTypes.number,
  limit: React.PropTypes.number,
  label: React.PropTypes.string,
  axis: React.PropTypes.string
}

UserMoviesList.defaultProps = {
  thumbW: 200,
  thumbH: 110,
  rowHeight: 200,
  axis: 'x',
  label: 'history.label'
}

export default withRouter(injectIntl(UserMoviesList))

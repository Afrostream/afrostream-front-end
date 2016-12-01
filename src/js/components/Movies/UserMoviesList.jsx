import React from 'react'
import { connect } from 'react-redux'
import MoviesSlider from './MoviesSlider'
import {
  intlShape,
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./UserMoviesList.less')
}

@connect(({User}) => ({User}))
class UserMoviesList extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    const {
      props: {
        User
      }
    } = this

    const dataList = User.get('history')
    if (!dataList) {
      return (<div />)
    }
    const label = 'history.label'
    const slug = 'history'
    const showTitle = true
    const showDescription = false
    const thumbW = 200
    const thumbH = 110
    const share = false
    const favorite = false
    const rowHeight = 160
    const load = true
    const type = 'episode'
    return (
      <div className="user-movie-history">
        <MoviesSlider
          {...this.props}
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
          favorite,
          rowHeight
        }} />
      </div>
    )
  }
}

UserMoviesList.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(UserMoviesList)

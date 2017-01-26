import React from 'react'
import { connect } from 'react-redux'
import MoviesSlider from '../Movies/MoviesSlider'
import {
  intlShape,
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./BrowseLifeUsersList.less')
}

@connect(({User, Life}) => ({User, Life}))
class BrowseLifeUsersList extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    const {
      props: {
        Life,
        axis,
        label,
        themeId,
        rowHeight,
        thumbW,
        thumbH
      }
    } = this

    const dataList = Life.get(`life/users/${themeId}`)

    if (!dataList) {
      return (<div />)
    }
    const slug = 'life/community'
    const type = 'user'
    const showTitle = true
    const showDescription = false
    const share = false
    const favorite = false
    const load = false

    return (
      <div className="browse-life-users-list">
        <MoviesSlider
          {...this.props}
          columnMaxWidth={thumbW}
          columnMinWidth={thumbW}
          className="browse-life-users-data-list movies-data-list"
          key={`browse-life-users-list`} {...{
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

BrowseLifeUsersList.propTypes = {
  intl: intlShape.isRequired,
  thumbW: React.PropTypes.number,
  thumbH: React.PropTypes.number,
  rowHeight: React.PropTypes.number,
  limit: React.PropTypes.number,
  themeId: React.PropTypes.string,
  label: React.PropTypes.string,
  axis: React.PropTypes.string
}

BrowseLifeUsersList.defaultProps = {
  thumbW: 160,
  thumbH: 160,
  rowHeight: 140,
  axis: 'x',
  label: 'life.users.label'
}

export default injectIntl(BrowseLifeUsersList)

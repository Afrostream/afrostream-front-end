import React from 'react'
import { connect } from 'react-redux'
import MoviesSlider from '../Movies/MoviesSlider'
import {
  intlShape,
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./BrowsePinsList.less')
}

@connect(({User, Life}) => ({User, Life}))
class BrowsePinsList extends React.Component {

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

    const dataList = Life.get(`life/pins/${themeId}`)

    if (!dataList) {
      return (<div />)
    }
    const slug = 'life'
    const type = 'pin'
    const showTitle = true
    const showDescription = false
    const share = false
    const favorite = false
    const load = false

    return (
      <div className="browse-pins-list">
        <MoviesSlider
          {...this.props}
          columnMaxWidth={thumbW}
          columnminWidth={thumbW}
          className="browse-pins-data-list movies-data-list"
          key={`browse-pins-list`} {...{
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

BrowsePinsList.propTypes = {
  intl: intlShape.isRequired,
  thumbW: React.PropTypes.number,
  thumbH: React.PropTypes.number,
  rowHeight: React.PropTypes.number,
  limit: React.PropTypes.number,
  themeId: React.PropTypes.string,
  label: React.PropTypes.string,
  axis: React.PropTypes.string
}

BrowsePinsList.defaultProps = {
  thumbW: 620,
  thumbH: 340,
  rowHeight: 340,
  axis: 'x',
  label: 'life.label'
}
export default injectIntl(BrowsePinsList)

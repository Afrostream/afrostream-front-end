import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import classSet from 'classnames'
import Headroom from 'react-headrooms'
import Immutable from 'immutable'
import { ArrowStepper } from '../Slider'
import { AutoSizer, ColumnSizer, CellMeasurer, Grid } from 'react-virtualized'

if (process.env.BROWSER) {
  require('./SubNavigation.less')
}

class SubNavigation extends Component {
  renderItem ({columnIndex, rowIndex}) {
    const {
      props: {
        themesList,
        to
      }
    } = this

    let theme = themesList.get(columnIndex)
    let mapTo = to
    mapTo = mapTo.replace(/{_id}/g, theme.get('_id'))
    mapTo = mapTo.replace(/{slug}/g, theme.get('slug'))

    return (
      <div className="cell" key={`theme-${columnIndex}`}>
        <Link activeClassName="active"
              to={mapTo}>{theme.get('label')}</Link>
      </div>
    )
  }

  render () {
    const {
      props: {
        themesList,
        to
      }
    } = this

    return (
      <Headroom tolerance={5} offset={200} classes={{
        initial: 'animated',
        pinned: 'slideDownSubHeader',
        unpinned: 'slideUpSubHeader'
      }}>
        <ul className="sub-navigation">
          {themesList && themesList.map((theme, i)=> {

              let mapTo = to
              mapTo = mapTo.replace(/{_id}/g, theme.get('_id'))
              mapTo = mapTo.replace(/{slug}/g, theme.get('slug'))

              return (<li key={`theme-${i}`}>
                <Link activeClassName="active"
                      to={mapTo}>{theme.get('label')}</Link>
              </li>)
            }
          )}
        </ul>
        {/* <div className="sub-navigation">
         <AutoSizer disableHeight>
         {({width}) => (
         <div style={{width}}>
         <CellMeasurer
         cellRenderer={::this.renderItem}
         columnCount={themesList.size}
         height={50}
         rowCount={1}
         >
         {({getColumnWidth, columnCount}) => (
         <Grid
         ref="reactGrid"
         cellRenderer={::this.renderItem}
         columnWidth={getColumnWidth}
         columnCount={columnCount}
         overscanColumnCount={0}
         overscanRowCount={0}
         rowHeight={50}
         height={50}
         rowCount={1}
         width={width}
         />
         )}
         </CellMeasurer>
         </div>
         )}
         </AutoSizer>
         </div>*/}
      </Headroom>
    )
  }
}


SubNavigation.propTypes = {
  themesList: PropTypes.instanceOf(Immutable.List).isRequired,
  to: PropTypes.string.isRequired,
}

SubNavigation.defaultProps = {}


export default SubNavigation

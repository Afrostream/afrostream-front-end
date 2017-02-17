import React, { PropTypes, Component } from 'react'
import { Link } from '../Utils'
import { connect } from 'react-redux'
import classSet from 'classnames'
import Headroom from 'react-headroom'
import Immutable from 'immutable'
import { ArrowStepper } from '../Slider'
import { AutoSizer, ColumnSizer, CellMeasurer, Grid } from 'react-virtualized'
import {
  FormattedMessage,
} from 'react-intl'
import { I18n } from '../Utils'
import { slugify } from '../../lib/utils'
import {
  injectIntl,
} from 'react-intl'

if (process.env.BROWSER) {
  require('./SubNavigation.less')
}

class SubNavigation extends I18n {
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
              to={mapTo}>{this.getTitle(theme.get('label'))}</Link>
      </div>
    )
  }

  render () {
    const {
      props: {
        themesList,
        to,
        streaming,
        children
      }
    } = this

    if (!themesList) {
      return (<div />)
    }
    return (
      <Headroom disableInlineStyles>
        <ul className="sub-navigation">
          {streaming && <li key={`theme-streaming`}>
            <Link activeClassName="active"
                  onlyActiveOnIndex
                  to="/"><FormattedMessage
              id={ `menu.streaming` }/></Link>
          </li>}
          {themesList && themesList.map((theme, i) => {

              let mapTo = to
              mapTo = mapTo.replace(/{_id}/g, theme.get('_id'))
              mapTo = mapTo.replace(/{slug}/g, theme.get('slug'))

              return (<li key={`theme-${i}`}>
                <Link activeClassName="active"
                      to={mapTo}>{this.getTitle(theme.get('label'))}</Link>
              </li>)
            }
          )}
        </ul>
        {children && children}
      </Headroom>
    )
  }
}


SubNavigation.propTypes = {
  themesList: PropTypes.instanceOf(Immutable.List),
  to: PropTypes.string.isRequired,
  streaming: PropTypes.bool,
}

SubNavigation.defaultProps = {
  streaming: false
}


export default injectIntl(SubNavigation)

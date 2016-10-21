import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import LifeList from './LifeList'
import { withRouter } from 'react-router'

@connect(({Life, User}) => ({Life, User}))
class LifeTheme extends Component {

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const {
      props: {
        Life,
        params:{
          themeId
        }
      }
    } = this

    const themesList = Life.get(`life/themes/${themeId || ''}`)
    const pins = themeId ? themesList && themesList.get('pins') : Life.get('life/pins/')
    const spots = themesList && themesList.get('spots')

    return (<div key="life-themes-list" className="life-theme">
      {pins && <LifeList {...this.props} {...{pins, spots, themeId}} virtual={true} key={`life-theme-pins`}/>}
    </div>)
  }
}

LifeTheme.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default withRouter(LifeTheme)

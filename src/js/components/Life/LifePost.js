import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import * as LifeActionCreators from '../../actions/life'
import * as ModalActionCreators from '../../actions/modal'
import config from '../../../../config/'
import classSet from 'classnames'
import Headroom from 'react-headrooms'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

if (process.env.BROWSER) {
  require('./LifePost.less')
}
@connect(({Life}) => ({Life}))
export default class LifePost extends Component {

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const {
      props: {
        Life
      }
    } = this


    return (
      <Headroom disableInlineStyles={true} tolerance={5} offset={200} classes={{
        initial: 'headroom',
        pinned: 'headroom--pinned',
        unpinned: 'headroom--unpinned',
        bottom: 'headroom--bottom'
      }}>
        <div className="life-pin-sticky">
          <TextField hintText="COPIER/COLLER un lien externe" fullWidth={true}/>
          <RaisedButton className="life-pin-action" primary={true} label="Poster"/>
        </div>
      </Headroom>
    )
  }
}

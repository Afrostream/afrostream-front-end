import React from 'react'
import classSet from 'classnames'

if (process.env.BROWSER) {
  require('./SwitchButton.less')
}

class SwitchButton extends React.Component {

  static propTypes = {
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    title: React.PropTypes.string,
    label: React.PropTypes.string,
    labelRight: React.PropTypes.string,
    icon: React.PropTypes.string,
    iconRight: React.PropTypes.string,
    defaultChecked: React.PropTypes.string,
    theme: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    checked: React.PropTypes.bool,
    onChange: React.PropTypes.func
  }

  static defaultProps = {
    id: '',
    name: 'switch-button',
    title: '',
    label: '',
    labelRight: '',
    icon: '',
    iconRight: '',
    defaultChecked: '',
    theme: 'rsbc-switch-button-flat-round',
    checked: null,
    disabled: false,
    onChange: () => {
    }
  }
  // Handle change
  handleChange () {
    // Override
  }

  render () {
    let id, label, labelRight, icon, iconRight

    if (this.props.id == '' && this.props.name != '') {
      id = this.props.name
    }

    if (this.props.label != '') {
      label = (
        <label htmlFor={id}>{this.props.label}</label>
      )
    }

    if (this.props.labelRight != '') {
      labelRight = (
        <label htmlFor={id}>{this.props.labelRight}</label>
      )
    }

    if (this.props.icon != '') {
      let classIcon = {
        enabled: this.props.checked
      }
      classIcon[this.props.icon] = true

      icon = (
        <i className={classSet(classIcon)} htmlFor={id}></i>
      )
    }

    if (this.props.iconRight != '') {

      let classIconRight = {
        enabled: this.props.checked
      }
      classIconRight[this.props.iconRight] = true

      iconRight = (
        <i className={classSet(classIconRight)} htmlFor={id}></i>
      )
    }

    return (
      <div className={'rsbc-switch-button ' + this.props.theme }>
        {label}
        {icon}
        <input onChange={this.props.onChange} checked={this.props.checked}
               disabled={this.props.disabled}
               id={id} name={this.props.name} type="checkbox" value="1"/>
        <label htmlFor={id}></label>
        {labelRight}
        {iconRight}
      </div>
    )
  }
}

export default SwitchButton

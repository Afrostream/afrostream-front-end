import React, { Component, PropTypes as T } from 'react'
import hoistStatics from 'hoist-non-react-statics'
import { isDefined, newScript, series, noop } from './utils'

const loadedScript = []
const pendingScripts = {}
let failedScript = []

export function startLoadingScripts (scripts, onComplete = noop, targetEl) {
  // sequence load
  const loadNewScript = (source) => {

    let src = source
    let att = null
    if (typeof source === 'object') {
      src = source.url
      att = source.attributes
    }

    if (loadedScript.indexOf(src) < 0) {
      return taskComplete => {
        const callbacks = pendingScripts[src] || []
        callbacks.push(taskComplete)
        pendingScripts[src] = callbacks
        if (callbacks.length === 1) {
          return newScript(src, att, targetEl)(err => {
            pendingScripts[src].forEach(cb => cb(err, src))
            delete pendingScripts[src]
          })
        }
      }
    }
  }

  const tasks = scripts.map(src => {
    if (Array.isArray(src)) {
      return src.map(loadNewScript)
    }
    else return loadNewScript(src)
  })

  series(...tasks)((err, src) => {
    if (err) {
      failedScript.push(src)
    }
    else {
      if (Array.isArray(src)) {
        src.forEach(addCache)
      }
      else addCache(src)
    }
  })(err => {
    removeFailedScript()
    onComplete(err)
  })
}

const addCache = (entry) => {
  if (loadedScript.indexOf(entry) < 0) {
    loadedScript.push(entry)
  }
}

const removeFailedScript = () => {
  if (failedScript.length > 0) {
    failedScript.forEach((script) => {
      const node = document.querySelector(`script[src='${script}']`)
      if (node != null) {
        node.parentNode.removeChild(node)
      }
    })

    failedScript = []
  }
}

const scriptLoader = (...scripts) => (WrappedComponent) => {
  class ScriptLoader extends Component {
    static propTypes = {
      onScriptLoaded: T.func
    }

    static defaultProps = {
      onScriptLoaded: noop
    }


    hasLib () {
      return this.state.isScriptLoadSucceed
    }

    constructor (props, context) {
      super(props, context)

      this.state = {
        isScriptPending: false,
        isScriptLoaded: false,
        isScriptLoadSucceed: false
      }
    }

    componentDidMount () {
      if (this.state.isScriptLoadSucceed || this.state.isScriptPending) {
        return
      }
      this.setState({
        isScriptPending: true
      })

      startLoadingScripts(scripts, err => {
        this.setState({
          isScriptPending: false,
          isScriptLoaded: true,
          isScriptLoadSucceed: !err
        }, () => {
          if (!err) {
            this.props.onScriptLoaded()
          }
        })
      })
    }

    render () {
      const props = {
        ...this.props,
        ...this.state
      }

      return (
        <WrappedComponent ref="wrapped" {...props} />
      )
    }
  }

  return hoistStatics(ScriptLoader, WrappedComponent)
}

export default scriptLoader

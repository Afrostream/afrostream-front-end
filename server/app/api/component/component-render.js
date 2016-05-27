import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import ReactDOM from 'react-dom'

const ReactHandler = {
  // path to react files
  PATH_TO_REACT_FILES: './build/reactjs/', // relative to node project root
  REACT_FILES_EXTENSION: 'jsx',
  NODE_ENV: process.env.NODE_ENV,
  // remove all require function cache
  _refreshRequireFunctionCache: function () {
    for (var prop in require.cache) {
      if (require.cache.hasOwnProperty(prop)) {
        const partialPath = path.resolve(__dirname + '/../../' + this.PATH_TO_REACT_FILES)
        if (prop.indexOf(partialPath) > -1) {
          delete require.cache[prop]
          console.log('Deleted cached required module: ' + prop)
        }
      }
    }
  },
  getComponent: function (componentAlias, componentProps, serverSideRender) {
    if (serverSideRender === undefined) serverSideRender = false
    if (componentProps === undefined || componentProps === null) componentProps = {}

    const regexCleanupPattern = /([^a-zA-Z])/g
    const reactCompNameOnBrowser = componentAlias.replace(regexCleanupPattern, '_')
    const randomId = Math.random().toString(36).substring(7)

    // script for client side
    const startup_code = '<script>var React = require("react")var ' +
      reactCompNameOnBrowser + '=React.render(React.createFactory(require("' +
      componentAlias +
      '"))(' + JSON.stringify(componentProps) + '), ' +
      'document.getElementById("' + randomId + '"))' +
      '</script>'
    // html for client side
    let componentHtml = '<div id="' + randomId + '"></div>'

    if (serverSideRender === true) {
      // handle file extension
      const extension = (this.REACT_FILES_EXTENSION !== null) ? this.REACT_FILES_EXTENSION : 'js'
      const compPath = path.resolve(this.PATH_TO_REACT_FILES, componentAlias + '.' + extension)

      // remove cache from required files if env is not production
      if (this.NODE_ENV !== 'production') {
        console.log('Rendered ReactJS component: ' + componentAlias)
        this._refreshRequireFunctionCache()
      }

      const component = require(compPath)
      console.log(component)
      const componentMounted = React.createElement(component, componentProps)
      console.log(componentMounted)
      const htmlC = ReactDOMServer.renderToString(componentMounted)
      console.log(htmlC)
      // html for client side
      componentHtml = '<div id="' + randomId + '">' + htmlC + '</div>'
    }

    const returnObj = {
      html: componentHtml,
      script: startup_code
    }
    return returnObj
  }
}

export default ReactHandler

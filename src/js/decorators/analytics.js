import React, { PropTypes } from 'react'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import shallowEqual from 'react-pure-render/shallowEqual'
import Q from 'q'
import request from 'superagent'
import config from '../../../config'
import * as GAActionCreators from '../actions/ga'
import window from 'global/window'

if (canUseDOM) {
  var ga = require('react-ga')
}

export default function analytics () {

  return AnalyticsComponent =>

    class AnalyticsDecorator extends React.Component {

      static contextTypes = {
        store: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      }

      getExperimentInfo (experiment) {
        var url = 'https://www.google-analytics.com/cx/api.js?experiment=' + experiment.key
        return Q(request
          .get(url)
          .then((response) => {
            const infoText = /experiments_=(.*?)\w+\.DEFAULT_ID=/m.exec(response.text)[1]
            let info = JSON.parse(infoText.replace(';', ''))[experiment.key]
            info.choose = window.cxApi.getChosenVariation(experiment.key)
            info.name = experiment.name
            return info
          }))
      }

      async bundle () {
        const {
          context: {store},
        } = this

        const experiments = config.google.abCodes
        return await Q()
          .then(() => {
            var promises = experiments.map(this.getExperimentInfo)
            return Promise.all(promises).then(function (infos) {
              var experimentsInfo = {}
              infos.forEach(function (info, index) {
                experimentsInfo[experiments[index].key] = info
              })
              return experimentsInfo
            })
          })
          .then((variationsInfos) => {
            return store.dispatch(GAActionCreators.setVariations(variationsInfos))
          })
      }

      render () {
        return (
          <AnalyticsComponent {...this.props} />
        )
      }

      componentWillReceiveProps (nextProps) {
        const {
          props: {location}
        } = this

        if (!shallowEqual(nextProps.location.pathname, location.pathname) && canUseDOM) {
          ga.pageview(nextProps.location.pathname)
        }
      }

      async componentDidMount () {
        const {
          props: {location}
        } = this

        if (canUseDOM) {
          //await this.bundle()
          ga.initialize(config.google.analyticsKey, {debug: true})
          ga.plugin.require('linkid')
          ga.plugin.require('ecommerce')
          ga.pageview(location.pathname)
        }
      }

    }
}

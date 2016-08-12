import _ from 'lodash'
import dictFr from './i18n/fr-FR.json'
import dictEn from './i18n/en-EN.json'

dictFr.signup = _.merge(_.cloneDeep(dictFr.signin), dictFr.signup)
dictFr.reset = _.merge(_.cloneDeep(dictFr.signin), dictFr.reset)
dictFr.relog = _.merge(_.cloneDeep(dictFr.signin), dictFr.relog)

dictEn.signup = _.merge(_.cloneDeep(dictEn.signin), dictEn.signup)
dictEn.reset = _.merge(_.cloneDeep(dictEn.signin), dictEn.reset)
dictEn.relog = _.merge(_.cloneDeep(dictEn.signin), dictEn.relog)

export function getI18n (lang = 'fr-FR') {
  switch (lang) {
    case 'en':
      return dictEn
      break
    default:
      return dictFr
      break
  }
}

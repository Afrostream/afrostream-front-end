import ActionTypes from '../consts/ActionTypes'
import { getCountry } from '../lib/geo'
import { merge } from 'lodash'
import config from '../../../config/'
import * as OAuthActionCreators from './oauth'
import MobileDetect from 'mobile-detect'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import window from 'global/window'
/**
 * Get subscriptions list for user
 * @returns {Function}
 */
export function getSubscriptions () {
  return (dispatch, getState) => {
    const user = getState().User.get('user')
    if (!user) {
      return {
        type: ActionTypes.Billing.getSubscriptions,
        res: null
      }
    }
    return async api => {
      return {
        type: ActionTypes.Billing.getSubscriptions,
        res: await api({
          path: `/api/subscriptions/status`,
          passToken: true
        })
      }
    }
  }
}

/**
 * Subscribe to afrostream plan
 * @param data
 * @returns {Function}
 */
export function subscribe (data) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Billing.subscribe,
      res: await api({
        path: `/api/billings/subscriptions`,
        method: 'POST',
        params: data,
        passToken: true
      })
    })
  }
}

export function cancelSubscription (subscription) {
  return (dispatch, getState, actionDispatcher) => {
    let uuid = subscription.get('subscriptionBillingUuid')
    let plan = subscription.get('internalPlan')
    if (plan) {
      let planUuid = plan.get('internalPlanUuid')
      if (planUuid === config.netsize.internalPlanUuid) {
        return actionDispatcher(OAuthActionCreators.netsizeSubscribe({path: 'unsubscribe'}))
      }
    }
    return async api => ({
      type: ActionTypes.Billing.cancelSubscription,
      res: await api({
        path: `/api/billings/subscriptions/${uuid}/cancel`,
        method: 'PUT',
        params: {},
        passToken: true
      })
    })
  }
}

/**
 * validate an afrostream coupon
 *
 * @param data
 * @returns {Function}
 */
export function couponValidate (data) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Billing.couponValidate,
      res: await api({
        path: `/api/billings/coupons`,
        params: data,
        passToken: true
      }).catch((err)=> {
        return {
          body: {
            coupon: null
          }
        }
      })
    })
  }
}
/**
 * validate an afrostream coupon
 *
 * @param data
 * @returns {Function}
 */
export function couponActivate () {
  return (dispatch, getState, actionDispatcher) => {

    const user = getState().User.get('user')
    const coupon = getState().Billing.get('coupon')

    let provider = config.sponsors.billingProviderName
    //FIXME provider n'est pas rempli par default, prendre "afr" de base
    try {
      provider = coupon.get('campaign').get('provider').get('providerName')
    } catch (e) {
      console.log('cant get provider name ', e)
    }

    const couponsCampaignType = coupon.get('campaign').get('couponsCampaignType')


    //IF coupon provider is not AFR redirect to select plan form
    if (couponsCampaignType === 'promo') {
      return new Promise((resolve, reject) => {
        resolve({
          type: ActionTypes.Billing.couponActivate
        })
      })
    }

    const billingInfo = {
      email: user.get('email'),
      id: user.get('_id'),
      internalPlanUuid: coupon.get('internalPlan').get('internalPlanUuid'),
      billingProviderName: provider,
      firstName: user.get('firstName'),
      lastName: user.get('lastName'),
      subOpts: {
        couponCode: coupon.get('code')
      }
    }

    return async () => {
      return await actionDispatcher(this.subscribe(billingInfo)).then(()=> {
        return ({
          type: ActionTypes.Billing.couponActivate,
        })
      })
    }

  }
}
/**
 * create new coupon
 *
 *
 * @param data {
 *  "couponCampaignBillingUuid" : "80bc2f24-bf54-4e13-9ecc-9d8bbe5e08ed"
 * }
 * @returns {Function}
 */
export function createCoupon (data) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Billing.createCoupon,
      res: await api({
        path: `/api/billings/coupons`,
        method: 'POST',
        params: data,
        passToken: true
      })
    })
  }
}

/**
 * list coupons
 *
 *
 * @param data {
 *  "billingProviderName" :"afr",
 *  "couponCampaignBillingUuid" : "a94bb541-090d-44b2-b9d2-6e557c212566"
 * }
 * @returns {Function}
 */
export function getSponsorsList (params) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Billing.sponsorsList,
      res: await api({
        path: `/api/billings/coupons/list`,
        params,
        passToken: true
      })
    })
  }
}

/**
 * Get coupon campain from billingProviderUuid
 * @returns {Function}
 */
export function getCouponCampaigns (params) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Billing.getCouponCampaigns,
      couponsCampaignBillingUuid: params.couponsCampaignBillingUuid,
      res: await api({
        path: `/api/billings/couponscampaigns`,
        params,
        passToken: true
      })
    })
  }
}

/**
 * Don't pass token on home page, if token expire, list of plans is empty
 * @param contextBillingUuid
 * @param passToken
 * @returns {function(*, *)}
 */
export function getInternalplans ({
  contextBillingUuid = 'common',
  passToken = true,
  reload = false,
  checkMobile = true,
  userId = null,
  country = 'FR'
}) {

  return (dispatch, getState, actionDispatcher) => {
    return async api => {
      let isMobile = false
      if (canUseDOM) {
        const userAgent = (window.navigator && navigator.userAgent) || ''
        let agent = new MobileDetect(userAgent)
        isMobile = agent.mobile()
      }
      //ONLY for common context,not cashway
      if (contextBillingUuid === 'common' && isMobile && checkMobile) {
        return await api({
          path: `/api/billings/internalplan/${config.netsize.internalPlanUuid}`,
          passToken
        }).then(({body})=> {
          return {
            type: ActionTypes.Billing.getInternalplans,
            contextBillingUuid: 'common',
            res: {
              body: [
                body
              ]
            }
          }
        })
      }

      let readyPlans = getState().Billing.get(`internalPlans/${contextBillingUuid}`)

      if (readyPlans && !reload) {
        console.log('plans already present in data store')
        return {
          type: ActionTypes.Billing.getInternalplans,
          contextBillingUuid,
          res: {
            body: readyPlans.toJS()
          }
        }
      }

      actionDispatcher({
        type: ActionTypes.Billing.getInternalplans,
        contextBillingUuid
      })

      let params = {
        contextBillingUuid,
        country
      }
      //ONLY for common context,not cashway
      if (contextBillingUuid === 'common') {
        const user = getState().User.get('user')
        const filterUserReferenceUuid = user && user.get('_id') || userId
        console.log('filterUserReferenceUuid', filterUserReferenceUuid)
        if (filterUserReferenceUuid) {
          try {
            country = await getCountry()
          } catch (err) {
            console.error('getInternalplans error requesting /auth/geo ', err)
          }

          params = {
            filterEnabled: true,
            country,
            filterUserReferenceUuid
          }
        }

      }
      return {
        type: ActionTypes.Billing.getInternalplans,
        contextBillingUuid,
        res: await api({
          path: `/api/billings/internalplans`,
          passToken,
          params
        })
      }
    }
  }
}

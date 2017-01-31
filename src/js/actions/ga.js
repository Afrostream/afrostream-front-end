import ActionTypes from '../consts/ActionTypes'
/**
 * Set A|B variations
 * @returns {Function}
 */
export function setVariations (variations) {
  return (dispatch, getState, actionDispatcher) => {
    return {
      type: ActionTypes.GA.setVariations,
      variations: variations
    }
  }
}

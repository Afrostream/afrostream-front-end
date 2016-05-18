import ActionTypes from '../consts/ActionTypes'

export function toggleNext () {
  return (dispatch, getState) => {
    const categoryId = getState().Category.get(`categoryId`)
    const category = getState().Category.get(`categorys/${categoryId}/spots`)
    const categorySpots = category//category && category.get('adSpots')
    const total = categorySpots ? categorySpots.size : 0
    const current = getState().Slides.get('page')
    let next = current + 1
    if (next > total - 1) {
      next = 0
    }
    return {
      type: ActionTypes.Slides.toggleNext,
      page: next
    }
  }
}

export function togglePrev () {
  return (dispatch, getState) => {
    const categoryId = getState().Category.get(`categoryId`)
    const category = getState().Category.get(`categorys/${categoryId}/spots`)
    const categorySpots = category && category.get('adSpots')
    const total = categorySpots ? categorySpots.size : 0
    const current = getState().Slides.get('page')
    let prev = current - 1
    if (prev < 0) {
      prev = total - 1
    }
    return {
      type: ActionTypes.Slides.togglePrev,
      page: prev
    }
  }
}

export function toggleSlide (index) {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Slides.toggleSlide,
      page: index
    }
  }
}

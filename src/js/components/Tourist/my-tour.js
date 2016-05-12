import React from 'react'
import Tour from './index.js'

const steps = [
  {
    component: 'PlayerComponent',
    ref: 'sendbird',
    content: 'Hello World!',
    getStyle: Tour.IndicatorStyles.newOne,
    doNotScroll: true
  }
];

const myTour = new Tour(steps)
export { myTour, steps }


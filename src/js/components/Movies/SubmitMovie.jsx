import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import * as omdb from '../../lib/omdb'
import Autosuggest from 'react-autosuggest'

if (process.env.BROWSER) {
  require('./SubmitMovie.less')
}

@connect(({Movie}) => ({Movie}))
class SubmitMovie extends React.Component {

  state = {
    value: '',
    suggestions: []
  }

  timeOMDB = 0

  constructor () {
    super()
  }

  onChange (event, {newValue}) {
    this.setState({
      value: newValue
    })
  }

  getSuggestionValue (suggestion) { // when suggestion selected, this function tells
    return suggestion.Title               // what should be the value of the input
  }

  renderSuggestion (suggestion) {
    return (
      <div className="suggestion">
        <img src={suggestion.Poster}/>
        <span>{suggestion.Title}</span>
      </div>
    )
  }


  onSuggestionsUpdateRequested ({value}) {
    clearTimeout(this.timeOMDB)
    if (value && value.length > 3) {
      this.timeOMDB = setTimeout(()=> {
        omdb.search({value}).then((movies) => {
          if (movies && movies.length) {
            this.setState({
              suggestions: movies
            })
          }
        })
      }, 500)
    }
  }


  render () {
    const {value, suggestions} = this.state

    const inputProps = {
      placeholder: 'Quels films / series / documentaires aimeriez vous voir sur Afrostream',
      value,
      onChange: ::this.onChange,
      type: 'search'
    }

    return (
      <div className="submit-movie">
        <h1>Recommendez nous des films</h1>
        <Autosuggest suggestions={suggestions}
                     onSuggestionsUpdateRequested={::this.onSuggestionsUpdateRequested}
                     getSuggestionValue={::this.getSuggestionValue}
                     renderSuggestion={::this.renderSuggestion}
                     inputProps={inputProps}/>
        <button type="submit" value="Subscribe" name="subscribe" id="subscribe-button">ENVOYER
        </button>
      </div>
    )
  }
}

export default SubmitMovie

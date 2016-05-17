import React from 'react';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

if (process.env.BROWSER) {
  require('./SubtitleMessage.less');
}

class SubtitleMessage extends React.Component {

  // do not render cookie message on server-side
  state = {
    isSubtitleCookieSet: "true"
  };

  componentDidMount() {
    let isSubtitleMessageRead = this.isSubtitleMessageRead();

    if (isSubtitleMessageRead !== "true") {
      this.setState({isSubtitleCookieSet: "false"});
    }
  }

  isSubtitleMessageRead() {
    let isSubtitleMessageRead = null;

    if (canUseDOM) {
      isSubtitleMessageRead = localStorage.getItem('afrostreamSubtitlesMessage');
    }
    return isSubtitleMessageRead;
  }

  setCookieToken() {
    if (canUseDOM) {
      localStorage.setItem('afrostreamSubtitlesMessage', "true");
      this.setState({isSubtitleCookieSet: "true"});
    }
  }

  render() {

    if (this.state.isSubtitleCookieSet === "true") {

      return (<div />);

    } else {

      return (
        <div className="subtitle-message">
          Un incident en cours de résolution empêche l’apparition des sous-titres sur Internet Explorer.
          Veuillez privilégier Google Chrome pour utiliser Afrostream et jouir pleinement du service.
          <a href="http://www.google.com/chrome/"
             onClick={this.setCookieToken.bind(this)}
             target="_blank">Télécharger Google Chrome</a>
          <button className="subtitle-button" onClick={this.setCookieToken.bind(this)}>OK</button>
        </div>
      );
    }
  }
}

export default SubtitleMessage;

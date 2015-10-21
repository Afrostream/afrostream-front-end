import React from 'react';

class IntercomScript extends React.Component {

  componentDidMount() {
    eval(document.getElementsByClassName('intercom-script')[0].innerHTML);

  }

  createMarkup() {
    return {__html: 'window.intercomSettings = {app_id: \'k3klwkxq\'};' +
                    '(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic(\'reattach_activator\');ic(\'update\',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement(\'script\');s.type=\'text/javascript\';s.async=true;s.src=\'https://widget.intercom.io/widget/k3klwkxq\';var x=d.getElementsByTagName(\'script\')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent(\'onload\',l);}else{w.addEventListener(\'load\',l,false);}}})();'
    };
  };

  render() {
    return (<div className="intercom-script" dangerouslySetInnerHTML={::this.createMarkup()} />);
  }
}

export default IntercomScript;

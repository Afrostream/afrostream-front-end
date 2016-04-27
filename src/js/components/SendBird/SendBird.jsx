'use strict';
import React, { PropTypes }  from 'react';
import { connect } from 'react-redux';
import SB from 'sendbird';
import { sendBird } from '../../../../config';
import classSet from 'classnames';
import _ from 'lodash';
import shallowEqual from 'react-pure-render/shallowEqual';

const sendBirdClient = SB.getInstance();

if (process.env.BROWSER) {
  require('./SendBird.less');
}

@connect(({User, Movie, Event}) => ({User, Movie, Event}))
class SendBird extends React.Component {

  static contextTypes = {
    location: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  };

  state = {
    init: false,
    open: false,
    options: false,
    messages: [],
    channelList: []
  };

  constructor (props, context) {
    super(props, context);
  }

  componentWillReceiveProps (nextProps) {
    const {
      props: {
        params:{
          movieId
        }
      }
    } = this;

    if ((!shallowEqual(nextProps.params.movieId, movieId) || !this.state.init) && nextProps.params.movieId) {
      this.startSendBird();
    }
  }

  /***********************************************
   *            SendBird Settings
   **********************************************/

  startSendBird () {

    const {
      props: {
        User
      }
    } = this;

    let user = User.get('user');
    if (!user) {
      return;
    }

    let guestId = user.get('_id');
    let nickName = user.get('email');
    let avatar = user.get('picture');

    this.setState({
      currentChannel: false,
      messages: [],
      guestId: guestId,
      nickName: nickName,
      userAvatar: avatar
    });

    this.loadBeat(true);

    sendBirdClient.init({
      'app_id': sendBird.appId,
      'guest_id': guestId,
      'user_name': nickName,
      'image_url': avatar,
      'successFunc': ::this.sendBirdInitSuccessHandler,
      'errorFunc': ::this.sendBirdErrorHandler
    });

    sendBirdClient.events.onMessageReceived = ::this.setChatMessage;
    sendBirdClient.events.onSystemMessageReceived = ::this.setChatMessage;
    sendBirdClient.events.onBroadcastMessageReceived = ::this.setChatMessage;
  }

  sendBirdInitSuccessHandler () {
    const {
      props: {
        params:{
          movieId
        }
      }
    } = this;

    this.setState({
      init: true
    });

    this.loadBeat(false);
    this.getMessagingChannelList();
    this.getChannelList(1);
    if (movieId) {
      this.joinChannel(`2b0a2.movie${movieId}`);
    }
    else {
      sendBirdClient.connect();
    }
  }

  sendBirdErrorHandler (status, error) {
    console.log(status, error);
  }

  isCurrentUser (guestId) {
    const {
      props: {
        User
      }
    } = this;

    let user = User.get('user');
    if (!user) {
      return;
    }

    let userId = user.get('_id');

    return (userId == guestId) ? true : false;
  }

  getChannelList (page) {
    sendBirdClient.getChannelList({
      'page': page,
      'limit': 20,
      'successFunc': ::this.createChannelList,
      'errorFunc': ::this.sendBirdErrorHandler
    });
  }

  getMessagingChannelList () {
    sendBirdClient.getMessagingChannelList({
      'successFunc': (data)=> {
        _.map(data['channels'], (channel) => {
          console.log(channel);
        });
      },
      'errorFunc': ::this.sendBirdErrorHandler
    });
  }

  joinChannel (channelUrl) {
    this.loadBeat(true);
    sendBirdClient.joinChannel(
      channelUrl,
      {
        'successFunc': ::this.onJoinChannelSuccess,
        'errorFunc': ::this.sendBirdErrorHandler
      }
    );
  }

  onJoinChannelSuccess (data) {
    this.setState({
      messages: [],
      currentChannel: data
    });

    sendBirdClient.connect({
      'successFunc': ::this.onJoinChannelConnected,
      'errorFunc': ::this.sendBirdErrorHandler
    });
  }

  onJoinChannelConnected () {
    this.loadMoreChatMessage();
    this.loadBeat(false);
  }

  createChannelList (obj) {
    this.setState({
      channelList: obj['channels']
    });
  }


  loadMoreChatMessage () {
    sendBirdClient.getMessageLoadMore({
      'limit': 50,
      'successFunc': ::this.lodMoreChatCompleteHandler,
      'errorFunc': ::this.sendBirdErrorHandler
    });
  }

  lodMoreChatCompleteHandler (data) {
    let moreMessage = data['messages'];
    _.map(moreMessage.reverse(), (msg)=> {
      if (sendBirdClient.isMessage(msg.cmd)) {
        this.setChatMessage(msg.payload);
      }
      // TODO make file compatibility
      // else if (sendBirdClient.isFileMessage(msg.cmd)) {
      //   if (!sendBirdClient.hasImage(msg.payload)) {
      //     msgList += this.fileMessageList(msg.payload);
      //   } else {
      //     msgList += this.imageMessageList(msg.payload);
      //   }
      // }
    });
    this.scrollPositionBottom();
  }

  /***********************************************
   *            SendBird Actions messaging
   **********************************************/

  onListenMessage (e) {
    var recognition = new webkitSpeechRecognition();
    recognition.onresult = function (event) {
      this.userSend(event.results[0][0].transcript);
    }.bind(this);
    recognition.start();
  }

  onSendMessageClick (e) {
    e.preventDefault();
    this.enterChatHandler();
  }

  onKeyPressHandler (e) {
    if ((e.keyCode === 13 || e.charCode === 13) && !e.shiftKey) {
      e.preventDefault();
      this.enterChatHandler();
    }
  }

  isEmpty (value) {
    return !!(value == null || value == undefined || value.length == 0);
  }

  enterChatHandler () {
    let valueMess = this.refs.chatSend.value.trim();
    if (!this.isEmpty(valueMess)) {
      this.refs.chatSend.calue = '';
      sendBirdClient.message(valueMess);
    }
  }

  setChatMessage (obj) {
    if (this.isEmpty(obj['message'])) return;

    let messages = this.state.messages;
    messages.push(obj);
    this.setState({
      messages: messages
    });
    this.scrollPositionBottom();
  }

  scrollPositionBottom () {
    this.refs.chatConverse.scrollTop = this.refs.chatConverse.scrollHeight
  }


  /***********************************************
   *            UI Chat
   **********************************************/

  toggleFab () {
    let toggle = !this.state.open;
    this.setState({
      open: toggle
    });
  }

  loadBeat (beat) {
    this.setState({
      loading: beat
    });
  }

  toggleOptions () {
    let toggle = !this.state.options;
    this.setState({
      options: toggle
    });
  }

  render () {
    const {
      props: {
        User, Event,
        params:{
          movieId
        }
      }
    } = this;

    const hiddenMode = !Event.get('userActive');
    const user = User.get('user');

    let fabsClasses = {
      'fabs': true,
      'yellow': true,
      'is-visible': ~sendBird.channels.indexOf(parseInt(movieId))
    };

    let primeClasses = {
      'prime': true,
      'fa': true,
      'fa-comments': !this.state.open,
      'fa-comments-o': this.state.open,
      'zmdi-close': this.state.open,
      'is-active': this.state.open
    };

    let chatClasses = {
      'chat': true,
      'is-visible': this.state.open
    };

    let optionsClasses = {
      'chat_option': true,
      'is-dropped': this.state.options
    };

    let converseClasses = {
      'chat_converse': true,
      'is-visible': this.state.currentChannel
    };

    let fabClasses = {
      'fab': true,
      'is-visible': this.state.currentChannel
    };

    let chatButtonClasses = _.extend(fabClasses, {
      'is-float': this.state.open,
      'is-visible': hiddenMode ? this.state.open : true
    });

    let channelListClasses = {
      'channel_list': true,
      'is-visible': !this.state.currentChannel
    };

    let inputsFieldsClasses = {
      'fab_field': true,
      'is-visible': this.state.currentChannel
    };

    let loaderClasses = {
      'chat_loader': true,
      'is-loading': this.state.loading
    };

    if (!user) {
      return <div />;
    }

    return (
      <div className={classSet(fabsClasses)}>
        <div className={classSet(chatClasses)}>
          <div className="chat_header">
            <span id="chat_head">{this.state.currentChannel ? this.state.currentChannel.name : 'Live Chat'}</span>
            <div className={classSet(loaderClasses)}/>
            <div className={classSet(optionsClasses)} onClick={::this.toggleOptions}>
              <i className="zmdi zmdi-more-vert"/>
              <ul className="channel_list">
                {
                  _.map(this.state.channelList, (channel)=> {

                    const onAction = {
                      onClick: event => ::this.joinChannel(channel.channel_url)
                    };

                    return <li key={channel.name}><span className="chat_channel"  {...onAction}>{channel.name}</span>
                    </li>;
                  })
                }
              </ul>
            </div>

          </div>
          <div className={classSet(channelListClasses)}>
            {
              _.map(this.state.channelList, (channel)=> {

                const onAction = {
                  onClick: event => ::this.joinChannel(channel.channel_url)
                };

                return <a key={channel.name}><span className="chat_channel"  {...onAction}>#{channel.name}</span>
                </a>;
              })
            }
          </div>
          <div ref="chatConverse" id="chat_converse" className={classSet(converseClasses)}>
            {
              _.map(this.state.messages, (obj)=> {

                let isUser = this.isCurrentUser(obj.user.guest_id);
                let img = obj.user.image;

                let avatarClasses = {
                  'chat_msg_item': true,
                  'chat_msg_item_user': isUser,
                  'chat_msg_item_admin': !isUser
                };
                return (
                  <div key={obj.msg_id} className={classSet(avatarClasses)}>
                    <div className="chat_avatar">{img ? <img src={img}/> : <i class="zmdi zmdi-account"/>}</div>
                    {obj.message}
                  </div>
                );
              })
            }
          </div>
          <div className={classSet(inputsFieldsClasses)}>
            <a id="fab_listen" className={classSet(fabClasses)} onClick={::this.onListenMessage}>
              <i className="zmdi zmdi-mic-outline"></i>
            </a>
            <a id="fab_send" className={classSet(fabClasses)} onClick={::this.onSendMessageClick}>
              <i className="zmdi zmdi-mail-send"></i>
            </a>
            <textarea ref="chatSend" id="chatSend" name="chat_message" placeholder="Votre message ..."
                      className="chat_field chat_message"
                      onKeyPress={::this.onKeyPressHandler}></textarea>
          </div>
        </div>
        <a id="prime" className={classSet(chatButtonClasses)} onClick={::this.toggleFab}>
          <i className={classSet(primeClasses)}></i>
        </a>
      </div>
    );
  }
}

export default SendBird;

'use strict';
import React, { PropTypes }  from 'react';
import { connect } from 'react-redux';
import SB from 'sendbird';
import { sendBird } from '../../../../config';
import classSet from 'classnames';
import _ from 'lodash';

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
    channelList: []
  };

  constructor (props, context) {
    super(props, context);
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
      open: true,
      currentChannel: false,
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
    sendBirdClient.events.onSystemMessageReceived = ::this.setSysMessage;
    sendBirdClient.events.onBroadcastMessageReceived = ::this.setBroadcastMessage;
  }

  sendBirdInitSuccessHandler () {
    const {
      props: {
        params:{
          movieId
        }
      }
    } = this;

    this.loadBeat(false);
    this.getMessagingChannelList();
    this.getChannelList(1);
    if (movieId) {
      this.joinChannel(`2b0a2.movie${movieId}`);
    } else {
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
    let valueMess = $.trim(this.refs.chatSend.value);
    if (!this.isEmpty(valueMess)) {
      sendBirdClient.message(valueMess);
    }
  }

  setSysMessage (obj) {
    this.sysSend(obj['message']);
  }

  setBroadcastMessage (obj) {
    this.sysSend(obj['message']);
  }

  setChatMessage (obj) {
    if (this.isEmpty(obj['message'])) return;

    if (this.isCurrentUser(obj['user']['guest_id'])) {
      this.userSend(obj['message'], obj['user']);
    } else {
      this.otherSend(obj['message'], obj['user']);
    }
  }

  userSend (text) {
    var img = !this.state.userAvatar ? '<i class="zmdi zmdi-account"></i>' : `<img src='${this.state.userAvatar}'/>`;
    $('#chat_converse').append('<div class="chat_msg_item chat_msg_item_user"><div class="chat_avatar">' + img + '</div>' + text + '</div>');
    this.refs.chatSend.value = '';
    if ($('.chat_converse').height() >= 256) {
      $('.chat_converse').addClass('is-max');
    }
    this.scrollPositionBottom();
  }

  sysSend (text) {
    $('#chat_converse').append('<div class="chat_msg_item chat_msg_item_admin"><div class="chat_avatar"><i class="zmdi zmdi-headset-mic"></i></div>' + text + '</div>');
    if ($('.chat_converse').height() >= 256) {
      $('.chat_converse').addClass('is-max');
    }
    this.scrollPositionBottom();
  }

  otherSend (text, user) {
    var img = !user || !user['image_url'] ? '<i class="zmdi zmdi-account"></i>' : `<img src='${user['image_url']}'/>`;

    $('#chat_converse').append('<div class="chat_msg_item chat_msg_item_admin"><div class="chat_avatar">' + img + '</div>' + text + '</div>');
    if ($('.chat_converse').height() >= 256) {
      $('.chat_converse').addClass('is-max');
    }
    this.scrollPositionBottom();
  }

  scrollPositionBottom () {
    $('.chat_converse').scrollTop($('.chat_converse')[0].scrollHeight);
  }


  /***********************************************
   *            UI Chat
   **********************************************/

  toggleFab () {

    let toggle = !this.state.open;
    this.setState({
      open: toggle
    });

    if (toggle) {
      this.startSendBird();
    }
  }

  hideChat (hide) {
    const {
      props: {
        User
      }
    } = this;

    const user = User.get('user');

    if (hide || !user) {
      $('.chat_converse').css('display', 'none');
      $('.fab_field').css('display', 'none');
    } else {
      $('.chat_converse').css('display', 'block');
      $('.fab_field').css('display', 'inline-block');
    }
  }

  loadBeat (beat) {
    beat ? $('.chat_loader').addClass('is-loading') : $('.chat_loader').removeClass('is-loading');
  }

  toggleOptions () {
    $('.chat_option').toggleClass('is-dropped');
  }

  render () {
    const {
      props: {
        User, Event
      }
    } = this;

    const hiddenMode = !Event.get('userActive');
    const user = User.get('user');
    let fabsClasses = {
      'fabs': true,
      'yellow': true,
      'fab-hidden': hiddenMode
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

    let fabClasses = {
      'fab': true,
      'is-float': true,
      'is-visible': this.state.currentChannel
    };

    let channelListClasses = {
      'channel_list': true,
      'is-visible': !this.state.currentChannel
    };

    let inputsFieldsClasses = {
      'fab_field': true,
      'is-visible': this.state.currentChannel
    };

    if (!user) {
      return <div />;
    }

    return (
      <div className={classSet(fabsClasses)}>
        <div className={classSet(chatClasses)}>
          <div className="chat_header">
            <span id="chat_head">{this.state.currentChannel ? this.state.currentChannel.name : 'Live Chat'}</span>
            <div className="chat_loader"></div>
            <div className="chat_option" onClick={::this.toggleOptions}><i className="zmdi zmdi-more-vert"></i>
              <ul className="modal-open-chat-list">
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
          <div id="chat_converse" className="chat_converse"/>
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
        <a id="prime" className={classSet(fabClasses)} onClick={::this.toggleFab}>
          <i className={classSet(primeClasses)}></i>
        </a>
      </div>
    );
  }
}

export default SendBird;

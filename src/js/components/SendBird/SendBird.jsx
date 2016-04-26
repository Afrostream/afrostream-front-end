'use strict';
import React, { PropTypes }  from 'react';
import { connect } from 'react-redux';
import SB from 'sendbird';
import { sendBird } from '../../../../config';
import _ from 'lodash';

const sendBirdClient = SB.getInstance();

if (process.env.BROWSER) {
  require('./SendBird.less');
}

@connect(({User}) => ({User}))
class SendBird extends React.Component {

  static contextTypes = {
    location: PropTypes.object.isRequired
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

    this.hideChat(true);
    this.loadBeat(true);

    sendBirdClient.init({
      'app_id': sendBird.appId,
      'guest_id': guestId,
      'user_name': nickName,
      'successFunc': ::this.sendBirdInitSuccessHandler,
      'errorFunc': ::this.sendBirdErrorHandler
    });

    sendBirdClient.events.onMessageReceived = ::this.setChatMessage;
    sendBirdClient.events.onSystemMessageReceived = ::this.setSysMessage;
    sendBirdClient.events.onBroadcastMessageReceived = ::this.setBroadcastMessage;

//Listen user voice
    $('#fab_listen').click(function () {
      var recognition = new webkitSpeechRecognition();
      recognition.onresult = function (event) {
        this.userSend(event.results[0][0].transcript);
      }
      recognition.start();
    });
  }

  sendBirdInitSuccessHandler () {
    this.loadBeat(false);
    this.getMessagingChannelList();
    this.getChannelList(1);
    sendBirdClient.connect();
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

  onJoinChannelSuccess () {
    sendBirdClient.connect({
      'successFunc': ::this.onJoinChannelConnected,
      'errorFunc': ::this.sendBirdErrorHandler
    });
  }

  onJoinChannelConnected () {
    this.loadBeat(false);
    this.hideChat(false);
  }

  createChannelList (obj) {
    this.setState({
      channelList: obj['channels']
    });
  }

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
    return !!(this == null || this == undefined || this.length == 0);
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
    if (this.isCurrentUser(obj['user']['guest_id'])) {
      this.userSend(obj['message']);
    } else {
      this.otherSend(obj['message']);
    }
  }

  userSend (text) {
    var img = '<i class="zmdi zmdi-account"></i>';
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

  otherSend (text) {
    $('#chat_converse').append('<div class="chat_msg_item chat_msg_item_admin"><div class="chat_avatar"><i class="zmdi zmdi-headset-mic"></i></div>' + text + '</div>');
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
    $('.prime').toggleClass('fa-comments-o');
    $('.prime').toggleClass('zmdi-close');
    $('.prime').toggleClass('is-active');
    $('#prime').toggleClass('is-float');
    $('.chat').toggleClass('is-visible');
    $('.fab').toggleClass('is-visible');
    this.startSendBird();
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
      $('#chat_head').html(user.get('email'));
      // Help
      $('#fab_help').click(function () {
        this.userSend('Help!');
      });
      $('.chat_login').css('display', 'none');
      $('.chat_converse').css('display', 'block');
      $('.fab_field').css('display', 'inline-block');
    }
  }

  userSend (text) {
    let img = '<i class="zmdi zmdi-account"></i>';
    $('#chat_converse').append('<div class="chat_msg_item chat_msg_item_user"><div class="chat_avatar">' + img + '</div>' + text + '</div>');
    this.refs.chatSend.value = '';
    if ($('.chat_converse').height() >= 256) {
      $('.chat_converse').addClass('is-max');
    }
    $('.chat_converse').scrollTop($('.chat_converse')[0].scrollHeight);
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
        User
      }
    } = this;

    let user = User.get('user');

    if (!user) {
      return <div />;
    }

    return (
      <div className="fabs yellow">
        <div className="chat">
          <div className="chat_header">
            <span id="chat_head">Live Chat</span>
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
          <div className="chat_login">
            {
              _.map(this.state.channelList, (channel)=> {

                const onAction = {
                  onClick: event => ::this.joinChannel(channel.channel_url)
                };

                return <a key={channel.name}><span className="chat_channel"  {...onAction}>{channel.name}</span>
                </a>;
              })
            }
          </div>
          <div id="chat_converse" className="chat_converse">
          </div>
          <div className="fab_field">
            <a id="fab_listen" className="fab" onClick={::this.onListenMessage}><i
              className="zmdi zmdi-mic-outline"></i></a>
            <a id="fab_send" className="fab" onClick={::this.onSendMessageClick}><i className="zmdi zmdi-mail-send"></i></a>
            <textarea ref="chatSend" id="chatSend" name="chat_message" placeholder="Write a message"
                      className="chat_field chat_message"
                      onKeyPress={::this.onKeyPressHandler}></textarea>
          </div>
        </div>
        <a id="prime" className="fab" onClick={::this.toggleFab}><i className="prime fa fa-comments"></i></a>
      </div>
    );
  }
}

export default SendBird;

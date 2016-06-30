import React, { PropTypes }  from 'react'
import { connect } from 'react-redux'
import sendbird from 'sendbird'
import config from '../../../../config'
import classSet from 'classnames'
import _ from 'lodash'
import shallowEqual from 'react-pure-render/shallowEqual'
import * as EventActionCreators from '../../actions/event'
import { withRouter } from 'react-router'
import SendBirdButton from './SendBirdButton'
const {sendBird} = config

if (process.env.BROWSER) {
  require('./SendBird.less')
}

@connect(({User, Movie, Event}) => ({User, Movie, Event}))
class SendBird extends React.Component {

  state = {
    init: false,
    open: false,
    options: false,
    users: [],
    messages: [],
    channelList: []
  }

  constructor (props, context) {
    super(props, context)
  }

  componentWillReceiveProps (nextProps) {
    const {
      props: {
        params:{
          movieId
        }
      }
    } = this
    if ((!shallowEqual(nextProps.params.movieId, movieId) || !this.state.init) && movieId) {
      this.startSendBird()
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
    } = this

    let user = User.get('user')
    if (!user) {
      return
    }

    let guestId = user.get('_id')
    let nickName = user.get('email')
    let avatar = user.get('picture')

    this.setState({
      init: true,
      currentChannel: false,
      messages: [],
      guestId: guestId,
      nickName: nickName,
      userAvatar: avatar
    })

    this.loadBeat(true)

    sendbird.init({
      'app_id': sendBird.appId,
      'guest_id': guestId,
      //'user_name': nickName,
      'image_url': avatar,
      'successFunc': ::this.sendBirdInitSuccessHandler,
      'errorFunc': ::this.sendBirdErrorHandler
    })

    sendbird.events.onMessageReceived = ::this.setChatMessage
    sendbird.events.onSystemMessageReceived = ::this.setChatMessage
    sendbird.events.onBroadcastMessageReceived = ::this.setChatMessage
    sendbird.events.onFileMessageReceived = ::this.setChatMessage
  }

  sendBirdInitSuccessHandler () {
    const {
      props: {
        params:{
          movieId
        }
      }
    } = this

    this.loadBeat(false)
    this.getMessagingChannelList()
    this.getChannelList(1)
    if (movieId) {
      this.joinChannel(`2b0a2.movie${movieId}`)
    }
    else {
      sendbird.connect()
    }
  }

  sendBirdErrorHandler (status, error) {
    console.log(status, error)
  }

  isCurrentUser (guestId) {
    const {
      props: {
        User
      }
    } = this

    let user = User.get('user')
    if (!user) {
      return
    }

    let userId = user.get('_id')

    return (userId == guestId) ? true : false
  }

  getUserList (options = {}) {
    options = _.extend({}, {'page': 1, 'token': '', 'limit': 30}, options)

    sendbird.getUserList({
      'token': options['token'],
      'page': options['page'],
      'limit': options['limit'],
      'successFunc': ::this.getUserListHandler,
      'errorFunc': ::this.sendBirdErrorHandler
    })
  }

  getUserListHandler (data) {
    var users = _.uniq(data['users'], (user)=> {
      return user.id
    })
    this.setState({users: users})
  }

  getChannelList (page) {
    sendbird.getChannelList({
      'page': page,
      'limit': 20,
      'successFunc': ::this.createChannelList,
      'errorFunc': ::this.sendBirdErrorHandler
    })
  }

  getMessagingChannelList () {
    sendbird.getMessagingChannelList({
      'successFunc': (data)=> {
        _.map(data['channels'], (channel) => {
          console.log(channel)
        })
      },
      'errorFunc': ::this.sendBirdErrorHandler
    })
  }

  joinChannel (channelUrl) {
    this.loadBeat(true)
    sendbird.joinChannel(
      channelUrl,
      {
        'successFunc': ::this.onJoinChannelSuccess,
        'errorFunc': ::this.sendBirdErrorHandler
      }
    )
  }

  onJoinChannelSuccess (data) {
    this.setState({
      messages: [],
      currentChannel: data
    })

    sendbird.connect({
      'successFunc': ::this.onJoinChannelConnected,
      'errorFunc': ::this.sendBirdErrorHandler
    })
  }

  onJoinChannelConnected () {
    this.loadMoreChatMessage()
    this.getUserList()
    this.loadBeat(false)
  }

  createChannelList (obj) {
    this.setState({
      channelList: obj['channels']
    })
  }


  loadMoreChatMessage () {
    sendbird.getMessageLoadMore({
      'limit': 50,
      'successFunc': ::this.lodMoreChatCompleteHandler,
      'errorFunc': ::this.sendBirdErrorHandler
    })
  }

  lodMoreChatCompleteHandler (data) {
    let moreMessage = data['messages']
    _.map(moreMessage.reverse(), (msg)=> {
      if (sendbird.isMessage(msg.cmd)) {
        this.setChatMessage(msg.payload)
      }
      else if (sendbird.isFileMessage(msg.cmd)) {
        this.setChatMessage(msg.payload)
      }
    })
    this.scrollPositionBottom()
  }

  /***********************************************
   *            SendBird Actions messaging
   **********************************************/

  onListenMessage (e) {
    var recognition = new webkitSpeechRecognition()
    recognition.onresult = function (event) {
      sendbird.message(event.results[0][0].transcript)
    }.bind(this)
    recognition.start()
  }

  onSendMessageClick (e) {
    e.preventDefault()
    this.enterChatHandler()
  }

  onKeyPressHandler (e) {
    if ((e.keyCode === 13 || e.charCode === 13) && !e.shiftKey) {
      e.preventDefault()
      this.enterChatHandler()
    }
  }

  isEmpty (value) {
    return !!(value == null || value == undefined || value.length == 0)
  }

  enterChatHandler () {
    let valueMess = this.refs.chatSend.value.trim()
    if (!this.isEmpty(valueMess)) {
      this.refs.chatSend.value = ''
      sendbird.message(valueMess)
    }
  }

  setChatMessage (obj) {
    if (this.isEmpty(obj.message || obj.url)) return
    let messages = this.state.messages
    messages.push(obj)
    this.setState({
      messages: messages
    })
    this.scrollPositionBottom()
  }

  scrollPositionBottom () {
    if (this.refs.chatConverse) {
      this.refs.chatConverse.scrollTop = this.refs.chatConverse.scrollHeight
    }
  }


  /***********************************************
   *            UI Chat
   **********************************************/

  toggleFab () {
    const {
      props: {
        Event,
        dispatch
      }
    } = this

    const chatMode = Event.get('showChat')
    let toggle = !chatMode
    dispatch(EventActionCreators.showChat(toggle))
  }

  loadBeat (beat) {
    this.setState({
      loading: beat
    })
  }

  toggleOptions () {
    let toggle = !this.state.options
    this.setState({
      options: toggle
    })
  }

  render () {
    const {
      props: {
        User, Event,
        params:{
          movieId
        }
      }
    } = this

    const hiddenMode = !Event.get('userActive')
    const user = User.get('user')
    const chatMode = Event.get('showChat')

    if (chatMode) {
      this.scrollPositionBottom()
    }

    let fabsClasses = {
      'fabs': true,
      'indigo': true,
      'is-enabled': chatMode,
      'is-visible': ~sendBird.channels.indexOf(parseInt(movieId))
    }

    let primeClasses = {
      'prime': true,
      'fa': true,
      'fa-comments': !chatMode,
      'fa-comments-o': chatMode,
      'zmdi-close': chatMode,
      'is-active': chatMode
    }

    let chatClasses = {
      'chat': true,
      'is-visible': chatMode
    }

    let optionsClasses = {
      'chat_option': true,
      'is-dropped': false//this.state.options
    }

    let converseClasses = {
      'chat_converse': true,
      'splited': this.state.options,
      'is-visible': this.state.currentChannel
    }

    let fabClasses = {
      'fab': true,
      'is-visible': this.state.currentChannel
    }

    let chatButtonClasses = _.extend(fabClasses, {
      'is-float': chatMode,
      'is-visible': hiddenMode ? chatMode : true
    })

    let menuClasses = {
      'menu': true,
      'is-visible': this.state.options
    }

    let inputsFieldsClasses = {
      'fab_field': true,
      'is-visible': this.state.currentChannel
    }

    let loaderClasses = {
      'chat_loader': true,
      'is-loading': this.state.loading
    }

    if (!user) {
      return <div />
    }

    return (
      <div className={classSet(fabsClasses)}>
        <div className={classSet(chatClasses)}>
          <div className="chat_header">
            <span id="chat_head">{this.state.currentChannel ? this.state.currentChannel.name : 'Live Chat'}</span>
            <SendBirdButton tipClass="zmdi zmdi-close" tipClassToggle="zmdi-close" tooltip="Quitter le chat"
                            sendBirdPosition="left" label="Quitter le chat"
                            sendBirdIntro="Fermer le chat"/>
            <div className={classSet(loaderClasses)}/>
            <div className={classSet(optionsClasses)} onClick={::this.toggleOptions}>
              <i className="zmdi zmdi-more-vert"/>
            </div>
          </div>
          <div className={classSet(menuClasses)}>
            {/*<span className="channel-list_title">Rooms</span>
             {
             _.map(this.state.channelList, (channel)=> {

             const onAction = {
             onClick: event => ::this.joinChannel(channel.channel_url)
             }

             return <a key={channel.name}><span className="chat_channel"  {...onAction}>#{channel.name}</span>
             </a>
             })
             }*/}
            <span className="channel-list_title">Utilisateurs</span>
            <div className="user_list">
              {_.map(this.state.users, ({guest_id, picture, id, is_online})=> {

                let isUser = this.isCurrentUser(guest_id)

                if (isUser) {
                  return
                }

                let img = picture

                const onAction = {
                  //onClick: event => ::this.joinChannel(channel.channel_url)
                }

                let avatarClasses = {
                  'chat_msg_item': true,
                  'is_online': is_online
                }

                return (
                  <div key={id} className={classSet(avatarClasses)} {...onAction}>
                    <div className="chat_avatar">{img ? <img src={img}/> : <i className="zmdi zmdi-account"/>}</div>
                    {/*<div className="chat_username">
                     {(user.nickname.length > 25 ? user.nickname.substring(0, 22) + '...' : user.nickname)}
                     </div>*/}
                  </div>
                )
              })
              }
            </div>
          </div>
          <div ref="chatConverse" id="chat_converse" className={classSet(converseClasses)}>
            {
              _.map(this.state.messages, ({user:{image, guest_id}, message, url, msg_id}, key)=> {

                let isUser = this.isCurrentUser(guest_id)
                let img = image

                let avatarClasses = {
                  'chat_msg_item': true,
                  'chat_msg_item_user': isUser,
                  'chat_msg_item_admin': !isUser
                }
                //this is a message
                return (
                  <div key={`${msg_id}_${key}`} className={classSet(avatarClasses)}>
                    <div className="chat_avatar">{img ? <img src={img}/> : <i className="zmdi zmdi-account"/>}</div>
                    {message}
                    {url ? <a href={url} target="_blank"><img className="chat_image" src={url}/></a> : null}
                  </div>
                )
              })
            }
          </div>
          <div className={classSet(inputsFieldsClasses)}
               data-intro="Ecrivez votre texte"
               data-position="left">
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
    )
  }
}

SendBird.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default withRouter(SendBird)

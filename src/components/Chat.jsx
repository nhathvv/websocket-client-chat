import { useEffect, useState } from 'react'
import socket from '../socket'
import axios from 'axios'
const profile = JSON.parse(localStorage.getItem('profile')) || {}
const usernames = [
  {
    name : "Hoang Van Nhat",
    value : 'nhathv'
  },
  {
    name : 'Nguyen Huu Phap',
    value : 'phapnh'
  }
]
export default function Chat() {
  const [value, setValue] = useState('')
  const [conversations, setConversations] = useState([])
  const [receiver, setReceiver] = useState('')
  const getProfile = (username) => {
    axios(`/users/${username}`, {
      baseURL: 'http://localhost:4000'
    }).then((res)=> {
      console.log(res)
      setReceiver(res.data.result._id)
      console.log(res.data.result._id)
      alert(`Now you can chat with ${res.data.result.name}`)
    }).catch((err) => {
      console.log(err)
    })
  }
  useEffect(()=> {
    socket.auth = {
      _id : profile._id
    }
    socket.connect()
    socket.on('receiver_message', (data)=> {
      const {payload} = data
      setConversations((messages) => [...messages, payload])
    })
    return () => {
      socket.disconnect()
    }
  },[])
  useEffect(()=> {
    if(receiver) {
      axios.get(`/conversations/receivers/${receiver}`, {
        baseURL: 'http://localhost:4000',
        headers : {
          Authorization : `Bearer ${localStorage.getItem('access_token')}`
        },
        params: {
          limit : 10,
          page: 1
        }
      }).then((res)=> {
        // console.log(conversation.sender_id === profile._id)
        setConversations(res.data.result.conversations)
      })
    }
  },[receiver])
  const handleSubmit = (e) => {
    e.preventDefault()
    setValue('')
    const conversation = {
      sender_id: profile._id,
      receiver_id: receiver,
      content: value
    }
    socket.emit('send_message', {
      payload : conversation
    })
    setConversations((messages) => [...messages, {
      ...conversation,
      _id: new Date().getTime()
    }])
  }
  return (
    <div>
    <h1>Chat</h1>
    <div className="chat">
    <div>
        {usernames.map((username) => (
          <div key={username.name}>
            <button onClick={() => getProfile(username.value)}>
              {username.name}
            </button>
          </div>
        ))}
      </div>
    <div>
        {conversations.map((conversation) => (
          <div key={conversation._id}>
            <div className="message-container">
              <div className={conversation.sender_id === profile._id ? 'message-right message' : "message"}>{conversation.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <button type='submit'>Send</button>
    </form>
  </div>
    
  )
}

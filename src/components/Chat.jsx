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
  const [messages, setMessages] = useState([])
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
    socket.on('receiver private message', (data)=> {
      console.log(data)
      const content = data.content
      setMessages((messages) => [...messages, {
        content,
        isSender: false
      }])
    })
    return () => {
      socket.disconnect()
    }
  },[])
  const handleSubmit = (e) => {
    e.preventDefault()
    setValue('')
    socket.emit('private message', {
      content: value,
      to : receiver // client 2
    })
    setMessages((messages) => [...messages, {
      content: value,
      isSender: true
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
        {messages.map((message, index) => (
          <div key={index}>
            <div className="message-container">
              <div className={message.isSender ? 'message-right message' : "message"}>{message.content}</div>
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

import { useEffect, useState } from 'react'
import socket from '../socket'
const getProfile = localStorage.getItem('profile')
const profile = getProfile ? JSON.parse(getProfile) : {}
export default function Chat() {
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState([])
  useEffect(()=> {
    socket.auth = {
      _id : profile._id
    }
    socket.connect()
    socket.on('receiver private message', (data)=> {
      console.log(data)
      const content = data.content
      setMessages((messages) => [...messages, content])
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
      to : '6648fe11bc5a07ae68f00141' // client 2
    })
  }
  return (
    <div>
    <h1>Chat</h1>
    <div>
        {messages.map((message, index) => (
          <div key={index}>
            <div>{message}</div>
          </div>
        ))}
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

import { RouterProvider } from 'react-router-dom'
import './App.css'
import AppRoutes from './router'
import { useEffect } from 'react'
import axios from 'axios'

function App() {
  const controller = new AbortController()
  useEffect(() => {
    const access_token = localStorage.getItem('access_token')
    axios.defaults.baseURL='http://localhost:4000'
    axios.get('/users/me', {
      headers : {
        Authorization : `Bearer ${access_token}`
      },
      signal: controller.signal
    }).then((res)=> {
      const profile = JSON.stringify(res.data.result)
      localStorage.setItem('profile',profile)
    }).catch((err) => {
      console.log(err)
    })
    return () => {
      controller.abort()
    }
  }, [])
  
  return <RouterProvider router={AppRoutes} />
}

export default App

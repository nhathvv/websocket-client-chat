import viteLogo from '../assets/react.svg'
import reactLogo from '../../public/vite.svg'

function Home() {
  const isAuthenticated = Boolean(localStorage.getItem('access_token'))
  const getProfile = localStorage.getItem('profile')
  const profile = getProfile ? JSON.parse(getProfile) : {}
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token')
    window.location.reload()
  }
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <p className='read-the-docs'>
        {isAuthenticated ? (
          <>
            <span>
              Hello my <strong>{profile.email}</strong>, you are logged in.
            </span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <p>Login with Google</p>
        )}
      </p>
    </>
  )
}

export default Home
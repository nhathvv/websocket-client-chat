import { createBrowserRouter} from 'react-router-dom';
import Home from './components/Home'
import Chat from './components/Chat';

const AppRoutes = createBrowserRouter([
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/chat',
    element: <Chat/>
  }
])

export default AppRoutes;
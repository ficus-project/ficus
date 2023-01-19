import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Resources from './pages/resources/ResourcesPage';
import Impact from './pages/impact/Impact';
import AppHeader from './components/AppHeader/AppHeader';

const router = createBrowserRouter([
  {
    path: '/resources',
    element: <Resources />,
  },
  {
    path: '/impact',
    element: <Impact />,
  },
]);

function App() {
  return (
    <div className="App">
      <AppHeader />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

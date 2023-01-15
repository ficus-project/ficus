import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NavigationSidebar from './components/NavigationSidebar/NavigationSidebar';
import './App.css';
import Resources from './pages/resources/Resources';

const router = createBrowserRouter([
  {
    path: '/resources',
    element: <Resources />,
  },
]);

function App() {
  return (
    <div className="App">
      <NavigationSidebar>
        <RouterProvider router={router} />
      </NavigationSidebar>
    </div>
  );
}

export default App;

import React from 'react'
import { useRoutes } from 'react-router-dom'
import Navigation from './components/Navigation'
import ViewPizzas from './pages/ViewPizzas'
import EditPizza from './pages/EditPizza'
import CreatePizza from './pages/CreatePizza'
import PizzaDetails from './pages/PizzaDetails'
import './App.css'

const App = () => {
  let element = useRoutes([
    {
      path: '/',
      element: <CreatePizza title="ARCHIE's PIZZERIA | Customize" />
    },
    {
      path:'/custompizzas',
      element: <ViewPizzas title="ARCHIE's PIZZERIA | CustomPizzas" />
    },
    {
      path: '/custompizzas/:id',
      element: <PizzaDetails title="ARCHIE's PIZZERIA | View" />
    },
    {
      path: '/edit/:id',
      element: <EditPizza title="ARCHIE's PIZZERIA | Edit" />
    }
  ])

  return (
    <div className='app'>

      <Navigation />

      { element }

    </div>
  )
}

export default App
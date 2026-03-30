import { useState, useEffect } from 'react'
import PizzaCard from '../components/PizzaCard'
import '../App.css'

const ViewPizzas = () => {
    const [pizzas, setPizzas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPizzas = async () => {
            try {
                const response = await fetch('/api/pizzas')
                const data = await response.json()
                setPizzas(data)
            } catch (error) {
                alert('Failed to load pizzas.')
            } finally {
                setLoading(false)
            }
        }

        fetchPizzas()
    }, [])

    const handleDelete = (id) => {
        setPizzas((prev) => prev.filter((p) => p.id !== id))
    }

    return (
        <div className='view-pizzas'>
            <center><h2>Custom Pizzas</h2></center>
            {loading
                ? <p>Loading...</p>
                : pizzas.length === 0
                ? <p>No pizzas yet. <a href='/'>Create one!</a></p>
                : <div className='pizza-grid'>
                    {pizzas.map((pizza) => (
                        <PizzaCard key={pizza.id} pizza={pizza} onDelete={handleDelete} />
                    ))}
                  </div>
            }
        </div>
    )
}

export default ViewPizzas

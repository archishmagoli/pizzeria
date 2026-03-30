import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PizzaVisual from '../components/PizzaVisual'
import { calculatePrice } from '../utils/pricing'
import '../App.css'

const PizzaDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [pizza, setPizza] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPizza = async () => {
            try {
                const response = await fetch(`/api/pizzas/${id}`)
                const data = await response.json()
                setPizza(data)
            } catch (error) {
                alert('Failed to load pizza.')
            } finally {
                setLoading(false)
            }
        }
        fetchPizza()
    }, [id])

    const handleDelete = async () => {
        if (!confirm(`Delete "${pizza.name}"?`)) return
        try {
            const response = await fetch(`/api/pizzas/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            if (!response.ok) {
                const err = await response.json()
                alert(`Error: ${err.error}`)
                return
            }
            alert(`Pizza "${pizza.name}" deleted successfully!`)
            navigate('/custompizzas')
        } catch (error) {
            alert('Sorry, an unexpected error occurred. Please try again.')
        }
    }

    if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}><p>Loading...</p></div>
    if (!pizza) return <div style={{ textAlign: 'center', marginTop: '3rem' }}><p>Pizza not found.</p></div>

    const toppings = pizza.details?.toppings ?? []

    return (
        <div style={{ maxWidth: 500, margin: '2rem auto', padding: '1.5rem', background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12 }}>
            <center><h2>{pizza.name}</h2></center>

            <PizzaVisual details={pizza.details} size={300} />

            <div style={{ marginTop: '1.5rem' }}>
                <p><strong>Type:</strong> {pizza.details?.pizzaType}</p>
                <p><strong>Size:</strong> {pizza.details?.size}</p>
                <p><strong>Crust:</strong> {pizza.details?.crust}</p>
                <p><strong>Sauce:</strong> {pizza.details?.sauce}</p>
                <p><strong>Cheese:</strong> {pizza.details?.cheeseLevel}</p>
                <p><strong>Toppings:</strong> {toppings.length > 0 ? toppings.join(', ') : 'none'}</p>
                {pizza.customInstructions && <p><em>"{pizza.customInstructions}"</em></p>}
                <p><strong>Total: ${calculatePrice(pizza.details)}</strong></p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={() => navigate(`/edit/${id}`)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={() => navigate('/custompizzas')}>← Back</button>
            </div>
        </div>
    )
}

export default PizzaDetails

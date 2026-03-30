import { useNavigate } from 'react-router-dom'
import { calculatePrice } from '../utils/pricing'
import '../css/PizzaCard.css'

const PizzaCard = ({ pizza, onDelete }) => {
    const navigate = useNavigate()

    const handleDelete = async () => {
        if (!confirm(`Delete "${pizza.name}"?`)) return
        try {
            const response = await fetch(`/api/pizzas/${pizza.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            if (!response.ok) {
                const err = await response.json()
                alert(`Error: ${err.error}`)
                return
            }
            onDelete(pizza.id)
        } catch (error) {
            alert('Sorry, an unexpected error occurred. Please try again.')
        }
    }

    const toppings = pizza.details?.toppings ?? []

    return (
        <div className='pizza-card'>
            <h3>{pizza.name}</h3>
            <p><strong>Type:</strong> {pizza.details?.pizzaType}</p>
            <p><strong>Size:</strong> {pizza.details?.size} | <strong>Crust:</strong> {pizza.details?.crust}</p>
            <p><strong>Sauce:</strong> {pizza.details?.sauce} | <strong>Cheese:</strong> {pizza.details?.cheeseLevel}</p>
            <p><strong>Toppings:</strong> {toppings.length > 0 ? toppings.join(', ') : 'none'}</p>
            {pizza.customInstructions && <p><em>"{pizza.customInstructions}"</em></p>}
            <p className='price'><strong>Total: ${calculatePrice(pizza.details)}</strong></p>
            <div className='card-buttons'>
                <button onClick={() => navigate(`/edit/${pizza.id}`)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}

export default PizzaCard

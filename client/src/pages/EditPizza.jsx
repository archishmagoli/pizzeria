import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../css/EditPizza.css'

const MEAT_TOPPINGS = ['pepperoni', 'sausage', 'bacon', 'chicken', 'ham', 'ground beef', 'anchovies']
const VEGGIE_TOPPINGS = ['mushrooms', 'peppers', 'olives', 'spinach', 'onions', 'tomatoes', 'jalapeños', 'artichokes']

const EditPizza = () => {

    const { id } = useParams()
    const [pizza, setPizza] = useState({
        name: '',
        customInstructions: '',
        details: {
            pizzaType: 'custom',
            toppings: []
        }
    })

    useEffect(() => {
        const fetchPizzaById = async () => {
            const response = await fetch(`/api/pizzas/${id}`)
            const data = await response.json()
            setPizza(data)
        }

        fetchPizzaById()
    }, [id])

    const handleNameChange = (event) => {
        setPizza((prev) => ({ ...prev, name: event.target.value }))
    }

    const handleInstructionsChange = (event) => {
        setPizza((prev) => ({ ...prev, customInstructions: event.target.value }))
    }

    const handlePizzaTypeChange = (event) => {
        const pizzaType = event.target.value
        setPizza((prev) => ({
            ...prev,
            details: {
                pizzaType,
                toppings: []
            }
        }))
    }

    const handleToppingChange = (event) => {
        const { value, checked } = event.target
        setPizza((prev) => ({
            ...prev,
            details: {
                ...prev.details,
                toppings: checked
                    ? [...prev.details.toppings, value]
                    : prev.details.toppings.filter((t) => t !== value)
            }
        }))
    }

    const isDisabled = (topping) => {
        if (pizza.details.pizzaType === 'vegetarian') return MEAT_TOPPINGS.includes(topping)
        if (pizza.details.pizzaType === 'meatLovers') return VEGGIE_TOPPINGS.includes(topping)
        return false
    }

    const updatePizza = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(`/api/pizzas/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: pizza.name,
                    details: pizza.details,
                    customInstructions: pizza.customInstructions
                })
            })

            if (!response.ok) {
                const err = await response.json()
                alert(`Error: ${err.error}`)
                return
            }

            await response.json()
            alert(`Pizza "${pizza.name}" updated successfully!`)
            navigate('/custompizzas')
        } catch (error) {
            alert('Sorry, an unexpected error occurred. Please try again.');
        } 
    }

    const deletePizza = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(`/api/pizzas/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })

            if (!response.ok) {
                const err = await response.json()
                alert(`Error: ${err.error}`)
                return
            }

            await response.json()
            alert(`Pizza "${pizza.name}" deleted successfully!`)
            navigate('/custompizzas')
        } catch (error) {
            alert('Sorry, an unexpected error occurred. Please try again.');
        } 
    }

    return (
        <div className='EditPizza'>
            <form>
                <label><h3>Name</h3></label>
                <input type='text' id='name' name='name' value={pizza.name} onChange={handleNameChange} /><br />
                <br />

                <label><h3>Select Pizza Type</h3></label>
                <div>
                    <div>
                        <input type="radio" id="custom" name="pizzaType" value="custom" checked={pizza.details.pizzaType === 'custom'} onChange={handlePizzaTypeChange} />
                        <label htmlFor="custom">Custom</label>
                    </div>
                    <div>
                        <input type="radio" id="vegetarian" name="pizzaType" value="vegetarian" checked={pizza.details.pizzaType === 'vegetarian'} onChange={handlePizzaTypeChange} />
                        <label htmlFor="vegetarian">Vegetarian</label>
                    </div>
                    <div>
                        <input type="radio" id="meatLovers" name="pizzaType" value="meatLovers" checked={pizza.details.pizzaType === 'meatLovers'} onChange={handlePizzaTypeChange} />
                        <label htmlFor="meatLovers">Meat Lovers</label>
                    </div>
                </div>
                <br />

                <label><h3>Toppings</h3></label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
                    <div>
                        <strong>Meat</strong>
                        {MEAT_TOPPINGS.map((topping) => (
                            <div key={topping}>
                                <input
                                    type="checkbox"
                                    id={topping}
                                    value={topping}
                                    checked={pizza.details.toppings.includes(topping)}
                                    disabled={isDisabled(topping)}
                                    onChange={handleToppingChange}
                                />
                                <label htmlFor={topping}>{topping}</label>
                            </div>
                        ))}
                    </div>
                    <div>
                        <strong>Veggie</strong>
                        {VEGGIE_TOPPINGS.map((topping) => (
                            <div key={topping}>
                                <input
                                    type="checkbox"
                                    id={topping}
                                    value={topping}
                                    checked={pizza.details.toppings.includes(topping)}
                                    disabled={isDisabled(topping)}
                                    onChange={handleToppingChange}
                                />
                                <label htmlFor={topping}>{topping}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <br />

                <label><h3>Custom Instructions</h3></label>
                <textarea rows='5' cols='50' id='customInstructions' name='customInstructions' value={pizza.customInstructions} onChange={handleInstructionsChange}></textarea>
                <br />

                <input className='submitButton' type='submit' value='Submit' onClick={updatePizza} />
                <button className='deleteButton' onClick={deletePizza}>Delete</button>
            </form>
        </div>
    )
}

export default EditPizza

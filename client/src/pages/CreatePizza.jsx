import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/CreatePizza.css'
import { calculatePrice } from '../utils/pricing'

const MEAT_TOPPINGS = ['pepperoni', 'sausage', 'bacon', 'chicken', 'ham', 'ground beef', 'anchovies']
const VEGGIE_TOPPINGS = ['mushrooms', 'peppers', 'olives', 'spinach', 'onions', 'tomatoes', 'jalapeños', 'artichokes']

const CreatePizza = () => {

    const [pizza, setPizza] = useState({
        name: '',
        customInstructions: '',
        details: {
            pizzaType: 'custom',
            toppings: [],
            size: 'medium',
            crust: 'thin',
            sauce: 'tomato',
            cheeseLevel: 'regular'
        }
    })

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
                ...prev.details,
                pizzaType,
                toppings: []
            }
        }))
    }

    const handleDetailChange = (event) => {
        const { name, value } = event.target
        setPizza((prev) => ({
            ...prev,
            details: { ...prev.details, [name]: value }
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

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch('/api/pizzas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: pizza.name,
                    customInstructions: pizza.customInstructions,
                    details: pizza.details
                })
            })

            if (!response.ok) {
                const err = await response.json()
                alert(`Error: ${err.error}`)
                return
            }

            await response.json()
            alert(`Pizza "${pizza.name}" created successfully!`)
            navigate('/custompizzas')
        } catch (error) {
            alert('Sorry, an unexpected error occurred. Please try again.')
        }
    }

    return (
        <div className='CreatePizza'>
            <center><h2>Add a pizza</h2></center>
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

                <label><h3>Size</h3></label>
                <select name="size" value={pizza.details.size} onChange={handleDetailChange}>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                </select>
                <br /><br />

                <label><h3>Crust</h3></label>
                <select name="crust" value={pizza.details.crust} onChange={handleDetailChange}>
                    <option value="thin">Thin</option>
                    <option value="thick">Thick</option>
                    <option value="stuffed">Stuffed</option>
                    <option value="glutenFree">Gluten-Free</option>
                </select>
                <br /><br />

                <label><h3>Sauce</h3></label>
                <select name="sauce" value={pizza.details.sauce} onChange={handleDetailChange}>
                    <option value="tomato">Tomato</option>
                    <option value="white">White</option>
                    <option value="bbq">BBQ</option>
                    <option value="pesto">Pesto</option>
                </select>
                <br /><br />

                <label><h3>Cheese Level</h3></label>
                <select name="cheeseLevel" value={pizza.details.cheeseLevel} onChange={handleDetailChange}>
                    <option value="none">None</option>
                    <option value="light">Light</option>
                    <option value="regular">Regular</option>
                    <option value="extra">Extra</option>
                </select>
                <br /><br />

                <label><h3>Custom Instructions</h3></label>
                <textarea rows='5' cols='50' id='customInstructions' name='customInstructions' value={pizza.customInstructions} onChange={handleInstructionsChange}></textarea>
                <br />

                <h3>Total: ${calculatePrice(pizza.details)}</h3>

                <input type='submit' value='Submit' onClick={handleSubmit} />
            </form>
        </div>
    )
}

export default CreatePizza
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../css/EditPizza.css'
import '../css/Carousel.css'
import { calculatePrice } from '../utils/pricing'
import PizzaVisual from '../components/PizzaVisual'

const MEAT_TOPPINGS = ['pepperoni', 'sausage', 'bacon', 'chicken', 'ham', 'ground beef', 'anchovies']
const VEGGIE_TOPPINGS = ['mushrooms', 'peppers', 'olives', 'spinach', 'onions', 'tomatoes', 'jalapeños', 'artichokes']

const STEPS = ['Name', 'Pizza Type', 'Toppings', 'Size', 'Crust', 'Sauce', 'Cheese', 'Instructions']

const EditPizza = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [step, setStep] = useState(0)
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
            details: { ...prev.details, pizzaType, toppings: [] }
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

    const updatePizza = async () => {
        const { pizzaType, toppings } = pizza.details

        if (!pizza.name.trim()) {
            alert('Please give your pizza a name.')
            setStep(0)
            return
        }

        const hasMeat = toppings.some((t) => MEAT_TOPPINGS.includes(t))
        const hasVeggie = toppings.some((t) => VEGGIE_TOPPINGS.includes(t))

        if (pizzaType === 'vegetarian' && hasMeat) {
            alert('A vegetarian pizza cannot have meat toppings.')
            return
        }
        if (pizzaType === 'meatLovers' && hasVeggie) {
            alert('A meat lovers pizza cannot have veggie toppings.')
            return
        }

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
            alert('Sorry, an unexpected error occurred. Please try again.')
        }
    }

    const deletePizza = async () => {
        if (!confirm(`Delete "${pizza.name}"?`)) return
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
            alert('Sorry, an unexpected error occurred. Please try again.')
        }
    }

    const renderStep = () => {
        switch (step) {
            case 0: return (
                <div>
                    <h3>Name your pizza</h3>
                    <input type='text' value={pizza.name} onChange={handleNameChange} placeholder='e.g. The Archie Special' />
                </div>
            )
            case 1: return (
                <div>
                    <h3>Pizza Type</h3>
                    {['custom', 'vegetarian', 'meatLovers'].map((type) => (
                        <div key={type}>
                            <input type="radio" id={type} name="pizzaType" value={type} checked={pizza.details.pizzaType === type} onChange={handlePizzaTypeChange} />
                            <label htmlFor={type}>{type === 'meatLovers' ? 'Meat Lovers' : type.charAt(0).toUpperCase() + type.slice(1)}</label>
                        </div>
                    ))}
                </div>
            )
            case 2: return (
                <div>
                    <h3>Toppings</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
                        <div>
                            <strong>Meat</strong>
                            {MEAT_TOPPINGS.map((topping) => (
                                <div key={topping}>
                                    <input type="checkbox" id={topping} value={topping} checked={pizza.details.toppings.includes(topping)} disabled={isDisabled(topping)} onChange={handleToppingChange} />
                                    <label htmlFor={topping}>{topping}</label>
                                </div>
                            ))}
                        </div>
                        <div>
                            <strong>Veggie</strong>
                            {VEGGIE_TOPPINGS.map((topping) => (
                                <div key={topping}>
                                    <input type="checkbox" id={topping} value={topping} checked={pizza.details.toppings.includes(topping)} disabled={isDisabled(topping)} onChange={handleToppingChange} />
                                    <label htmlFor={topping}>{topping}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
            case 3: return (
                <div>
                    <h3>Size</h3>
                    {['small', 'medium', 'large'].map((s) => (
                        <div key={s}>
                            <input type="radio" id={s} name="size" value={s} checked={pizza.details.size === s} onChange={handleDetailChange} />
                            <label htmlFor={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</label>
                        </div>
                    ))}
                </div>
            )
            case 4: return (
                <div>
                    <h3>Crust</h3>
                    {[['thin', 'Thin'], ['thick', 'Thick'], ['stuffed', 'Stuffed'], ['glutenFree', 'Gluten-Free']].map(([val, label]) => (
                        <div key={val}>
                            <input type="radio" id={val} name="crust" value={val} checked={pizza.details.crust === val} onChange={handleDetailChange} />
                            <label htmlFor={val}>{label}</label>
                        </div>
                    ))}
                </div>
            )
            case 5: return (
                <div>
                    <h3>Sauce</h3>
                    {[['tomato', 'Tomato'], ['white', 'White'], ['bbq', 'BBQ'], ['pesto', 'Pesto']].map(([val, label]) => (
                        <div key={val}>
                            <input type="radio" id={val} name="sauce" value={val} checked={pizza.details.sauce === val} onChange={handleDetailChange} />
                            <label htmlFor={val}>{label}</label>
                        </div>
                    ))}
                </div>
            )
            case 6: return (
                <div>
                    <h3>Cheese Level</h3>
                    {[['none', 'None'], ['light', 'Light'], ['regular', 'Regular'], ['extra', 'Extra']].map(([val, label]) => (
                        <div key={val}>
                            <input type="radio" id={val} name="cheeseLevel" value={val} checked={pizza.details.cheeseLevel === val} onChange={handleDetailChange} />
                            <label htmlFor={val}>{label}</label>
                        </div>
                    ))}
                </div>
            )
            case 7: return (
                <div>
                    <h3>Custom Instructions</h3>
                    <textarea rows='4' cols='40' value={pizza.customInstructions} onChange={handleInstructionsChange} placeholder='e.g. extra crispy, cut into squares...' />
                </div>
            )
            default: return null
        }
    }

    return (
        <div className='EditPizza'>
            <center><h2>Edit Your Pizza</h2></center>

            <PizzaVisual details={pizza.details} />

            <div className='carousel'>
                <div className='step-indicator'>
                    {STEPS.map((s, i) => (
                        <span key={s} className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} onClick={() => setStep(i)} />
                    ))}
                </div>

                <div className='step-content'>
                    {renderStep()}
                </div>

                <div className='carousel-nav'>
                    <button onClick={() => setStep((s) => s - 1)} disabled={step === 0}>← Back</button>
                    <span>{STEPS[step]} ({step + 1}/{STEPS.length})</span>
                    {step < STEPS.length - 1
                        ? <button onClick={() => setStep((s) => s + 1)}>Next →</button>
                        : <button onClick={updatePizza}>Save — ${calculatePrice(pizza.details)}</button>
                    }
                </div>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button className='deleteButton' onClick={deletePizza}>Delete Pizza</button>
                </div>
            </div>
        </div>
    )
}

export default EditPizza

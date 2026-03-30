const BASE_PRICE = 8.00

const TOPPING_PRICES = {
    // Meat
    pepperoni:    1.50,
    sausage:      1.50,
    bacon:        1.75,
    chicken:      1.75,
    ham:          1.25,
    'ground beef':1.50,
    anchovies:    1.25,
    // Veggie
    mushrooms:    0.75,
    peppers:      0.75,
    olives:       0.75,
    spinach:      0.75,
    onions:       0.50,
    tomatoes:     0.50,
    'jalapeños':  0.75,
    artichokes:   1.00,
}

const SIZE_MULTIPLIERS = {
    small:  0.8,
    medium: 1.0,
    large:  1.3,
}

const CRUST_PRICES = {
    thin:       0,
    thick:      0,
    stuffed:    2.00,
    glutenFree: 1.50,
}

const SAUCE_PRICES = {
    tomato: 0,
    white:  0.75,
    bbq:    0.75,
    pesto:  1.00,
}

const CHEESE_PRICES = {
    none:    -0.50,
    light:   0,
    regular: 0,
    extra:   1.00,
}

export const calculatePrice = (details) => {
    if (!details) return BASE_PRICE

    const { toppings = [], size = 'medium', crust = 'thin', sauce = 'tomato', cheeseLevel = 'regular' } = details

    const toppingTotal = toppings.reduce((sum, t) => sum + (TOPPING_PRICES[t] ?? 0), 0)
    const subtotal = BASE_PRICE + toppingTotal + (CRUST_PRICES[crust] ?? 0) + (SAUCE_PRICES[sauce] ?? 0) + (CHEESE_PRICES[cheeseLevel] ?? 0)

    return (subtotal * (SIZE_MULTIPLIERS[size] ?? 1)).toFixed(2)
}

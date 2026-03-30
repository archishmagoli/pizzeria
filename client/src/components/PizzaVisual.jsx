const TOPPING_EMOJI = {
    pepperoni:    '🔴',
    sausage:      '🟤',
    bacon:        '🥓',
    chicken:      '🍗',
    ham:          '🟠',
    'ground beef':'🟫',
    anchovies:    '🐟',
    mushrooms:    '🍄',
    peppers:      '🫑',
    olives:       '⚫',
    spinach:      '🥬',
    onions:       '🧅',
    tomatoes:     '🍅',
    'jalapeños':  '🌶️',
    artichokes:   '💚',
}

// Shared pool of well-distributed positions across the pizza face
const POSITION_POOL = [
    { top: '22%', left: '44%' }, { top: '44%', left: '70%' }, { top: '68%', left: '50%' }, { top: '44%', left: '22%' },
    { top: '28%', left: '28%' }, { top: '28%', left: '62%' }, { top: '62%', left: '30%' }, { top: '62%', left: '60%' },
    { top: '44%', left: '44%' }, { top: '35%', left: '52%' }, { top: '52%', left: '35%' }, { top: '35%', left: '35%' },
    { top: '52%', left: '55%' }, { top: '20%', left: '52%' }, { top: '55%', left: '22%' }, { top: '68%', left: '38%' },
    { top: '38%', left: '65%' }, { top: '25%', left: '38%' }, { top: '58%', left: '48%' }, { top: '44%', left: '32%' },
]

// Assigns pool slots to toppings in round-robin so they never overlap
const assignPositions = (toppings, slotsPerTopping = 3) => {
    return toppings.flatMap((topping, ti) =>
        Array.from({ length: slotsPerTopping }, (_, i) => ({
            topping,
            pos: POSITION_POOL[(ti + i * toppings.length) % POSITION_POOL.length]
        }))
    )
}

const SAUCE_COLORS = {
    tomato: '#c0392b',
    white:  '#f0e6d3',
    bbq:    '#6b2d0f',
    pesto:  '#4a7c3f',
}

const CHEESE_COLORS = {
    none:    'transparent',
    light:   '#f5d98a',
    regular: '#f0c040',
    extra:   '#e8b020',
}

const CRUST_SIZES = {
    thin:       12,
    thick:      24,
    stuffed:    30,
    glutenFree: 16,
}

const PizzaVisual = ({ details, size = 300 }) => {
    const {
        sauce = 'tomato',
        cheeseLevel = 'regular',
        crust = 'thin',
        toppings = [],
    } = details || {}

    const crustInset = CRUST_SIZES[crust] ?? 12

    return (
        <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
            {/* Crust */}
            <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: '#c8965a',
            }} />

            {/* Sauce */}
            <div style={{
                position: 'absolute',
                inset: crustInset,
                borderRadius: '50%',
                background: SAUCE_COLORS[sauce],
                transition: 'background 0.3s',
            }} />

            {/* Cheese */}
            <div style={{
                position: 'absolute',
                inset: crustInset + 8,
                borderRadius: '50%',
                background: CHEESE_COLORS[cheeseLevel],
                opacity: cheeseLevel === 'none' ? 0 : 1,
                transition: 'background 0.3s, opacity 0.3s',
            }} />

            {/* Toppings */}
            {assignPositions(toppings).map(({ topping, pos }, i) => (
                <span key={`${topping}-${i}`} style={{
                    position: 'absolute',
                    top: pos.top,
                    left: pos.left,
                    fontSize: '1.4rem',
                    lineHeight: 1,
                    userSelect: 'none',
                }}>
                    {TOPPING_EMOJI[topping] ?? '🍕'}
                </span>
            ))}
        </div>
    )
}

export default PizzaVisual

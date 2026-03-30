import PizzeriaController from '../controllers/pizza.js'
import express from 'express'

const router = express.Router()

router.get('/', PizzeriaController.getPizzas)
router.get('/:pizzaId', PizzeriaController.getPizzaById)
router.post('/', PizzeriaController.createPizza)
router.delete('/:id', PizzeriaController.deletePizza)
router.patch('/:id', PizzeriaController.updatePizza)

export default router
import { CalcApplication } from './modules/application/calcApplication'
import { ConvertApplication } from './modules/application/convertApplication'
import { VariableApplication } from './modules/application/variableApplication'

import './../css/style.css'

const variable = new VariableApplication()

function submitCalc () {
  const convert = new ConvertApplication()
  const val = document.getElementById('formulaInput') as HTMLInputElement
  convert.setFormula(val.value)
  let rpn = convert.convertRpn()
  rpn = variable.convertVariable(rpn)
  const calc = new CalcApplication()
  calc.setRpnArr(rpn)
  const result = calc.calc()
  val.value = result
}

document.getElementById('formulaForm').addEventListener('submit', (e) => {
  e.preventDefault()
  submitCalc()
})

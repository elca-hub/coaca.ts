import { CalcApplication } from './modules/application/calcApplication'
import { ConvertApplication } from './modules/application/convertApplication'
import { VariableApplication } from './modules/application/variableApplication'
import { ViewApplication } from './modules/application/viewApplication'

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

function variableAdd () {
  const view = new ViewApplication()
  view.createVariableInput(variable)
  view.showAlert()
}

document.getElementById('formulaForm').addEventListener('submit', (e) => {
  e.preventDefault()
  submitCalc()
})

document.getElementById('variableAdd').addEventListener('click', (e) => {
  e.preventDefault()
  variableAdd()
})

function init () {
  const view = new ViewApplication()
  view.viewVariableList(variable.getRepository())
}

init()

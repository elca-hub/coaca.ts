import {Calc, ConvertRpn, Variable} from './coaca'

import './../css/style.css'

const variableList = {
  a: 15,
  b: 13,
  c: 14
}

const setVariableList = (variable: any, variableList: object) => {
  for (let key in variableList) {
    variable.addVariable(key, variableList[key])
  }
}

/* sを求める処理 */
const s = (): string => {
  const convert = new ConvertRpn()
  convert.setFormula('(a+b+c)/2')
  let rpnArr = convert.convertRpn()

  const variable = new Variable()
  setVariableList(variable, variableList)
  rpnArr = variable.convertVariable(rpnArr)

  const calc = new Calc()
  return String(calc.calc(rpnArr))
}

const res = (sNum: string) => {
  const convert = new ConvertRpn()
  convert.setFormula('(s*(s-a)*(s-b)*(s-c))^(1/2)')
  let rpnArr = convert.convertRpn()

  const variable = new Variable()
  setVariableList(variable, variableList)
  variable.addVariable('s', Number(sNum))
  rpnArr = variable.convertVariable(rpnArr)

  const calc = new Calc()
  return calc.calc(rpnArr)
}

console.log(res(s()))

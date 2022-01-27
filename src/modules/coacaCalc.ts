import { Variable } from "./caocaVariable.js"
import { FormulaControl } from "./coacaFormulaControl.js"

export class Calc {
  private rpnArr: string[]
  private variableClass: Variable
  constructor (vc: Variable) {
    this.variableClass = vc
  }
  setRpnArr (rpnArr: string[]) {
    this.rpnArr = rpnArr
  }
  /**
   * RPN配列に格納されている数式を基に計算を行う
   * @returns 計算結果(文字列)
   */
  rpnCalc () {
    this.variableClass.convertVariable(this.rpnArr) // 数式に使用されている変数を代入
    let stack: string[] = []
    let fcClass = new FormulaControl()
    this.rpnArr.forEach(val => {
      if (!fcClass.isOperator(val)) stack.push(val)
      else stack.push(String(fcClass.calculate(val, stack.pop(), stack.pop())))
    })
    return stack[0]
  }
}
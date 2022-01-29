import { FormulaControl } from "./formulaControl.js"

export class Calc {
  private rpnArr: string[]
  constructor (rpnArr: string[]) {
    this.rpnArr = rpnArr
  }
  /**
   * RPN配列に格納されている数式を基に計算を行う
   * @returns 計算結果(文字列)
   */
  rpnCalc (rpnArr = null) {
    let stack: string[] = []
    let fcClass = new FormulaControl()
    const targetArr = rpnArr === null ? this.rpnArr : rpnArr
    for (let i = 0; i < targetArr.length; i++) {
      const val = targetArr[i]
      if (!fcClass.isOperator(val) && !fcClass.isSpecialOperator(val) && !fcClass.isBracket(val)) stack.push(val)
      if (fcClass.isSpecialOperator(val)) {
        let startIndex = 0
        let nestCount = 0
        let endIndex = 0
        for (let j = i + 1; j < targetArr.length; j++) {
          console.log(targetArr[j])
          if (targetArr[j] === '[') {
            if (nestCount === 0) startIndex = j + 1
            nestCount++
          }
          if (targetArr[j] === ']') nestCount--
          if (nestCount === 0 && !fcClass.isOperator(targetArr[j])) {
            endIndex = j
            break
          }
          if (j + 1 === targetArr.length) {
            endIndex = j + 1
            break
          }
        }
        const subRpnArr = targetArr.slice(startIndex, endIndex)
        const subCalc = new Calc(subRpnArr)
        stack.push(String(fcClass.specialCalc(val, subCalc.rpnCalc())))
        i = endIndex
      } else if (fcClass.isOperator(val)) {
        stack.push(String(fcClass.calculate(val, stack.pop(), stack.pop())))
      }
    }
    return stack[0]
  }
}

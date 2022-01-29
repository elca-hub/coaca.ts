import { FormulaControl } from "./formulaControl.js"

export class Convert {
  private formula: string
  constructor (formula: string) {
    this.formula = formula
  }
  private setOperatorAndNum (formula: string) {
    const res = []
    let add = ''
    let flag = false
    const fcClass = new FormulaControl()
    for (let i = 0; i < formula.length; i++) {
      let val = formula.substring(i, i + 1)
      val = val.replace(/\s+/g, "")
      if (!fcClass.isOperator(val) && !fcClass.isParren(val) && !fcClass.isBracket(val)) {
        add += val
      } else {
        if (add !== '') {
          // 負数の場合の記述
          if (val === ')' && flag) {
            add = '-' + add
            flag = false
          }
          res.push(add) // 数値があったら
        }
        if (res[res.length - 1] === '(' && val === '-') {
          flag = true
          continue
        } else {
          res.push(val)
        }
        add = ''
      }
    }
    if (add !== '') res.push(add)
    return res
  }
  private exchange (data = '') {
    const res = []
    const stock = []
    let flag = false
    const formula = data === '' ? this.formula : data
    const valList = this.setOperatorAndNum(formula)
    const fcClass = new FormulaControl()

    for (let i = 0; i < valList.length; i++) {
      const val = valList[i]
      if (val === '') continue
      if (!(fcClass.isOperator(val) || fcClass.isParren(val))) {
        res.push(val)
        if (stock.length) res.push(stock.pop())
      } else if (fcClass.isOperator(val)) {
        if (!stock.length && !res.length && val === '-') {
          const num = valList.slice(i, valList.length).join('')
          res.push(num)
          break
        }
        if (flag && fcClass.importanceNum(val) > fcClass.importanceNum(res[res.length - 1])) stock.push(res.pop())
        flag = true
        stock.push(val)
      } else if (fcClass.isParren(val)) {
        const startIndex = i + 1
        let nestCount = 0
        let endIndex = 0
        for (let j = i; j < valList.length; j++) {
          if (valList[j] === '(') nestCount++
          if (valList[j] === ')') nestCount--
          if (nestCount === 0) {
            endIndex = j
            break
          }
          if (j + 1 === valList.length) {
            endIndex = j + 1
            break
          }
        }
        const subFormula = valList.slice(startIndex, endIndex).join('')
        res.push(...this.exchange(subFormula))
        if (stock.length) res.push(stock.pop())
        i = endIndex
      }
    }
    stock.forEach((i) => res.push(i))
    return res
  }
  convertToRPN () {
    return this.exchange()
  }
}

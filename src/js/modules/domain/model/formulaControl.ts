import { Big } from 'big.js'

export class FormulaControl {
  private operatorList: string[]
  private specialOperatorList: string[]
  constructor () {
    this.operatorList = ['+', '-', '*', '/', '^', '_', '%']
    this.specialOperatorList = ['sin', 'cos', 'tan', '!', 'rad', 'abs', 'asin', 'acos', 'atan', 'ln']
  }
  /**
   * 検索対象が演算子であるかどうか
   * @param val 検索対象の文字
   * @returns 結果
   */
  isOperator (val: string) {
    return this.operatorList.indexOf(val) !== -1
  }
  isSpecialOperator (val: string) {
    return this.specialOperatorList.indexOf(val) !== -1
  }
  /**
   * 検索対象が丸括弧であるかどうか
   * @param val 検索対象の文字列
   * @returns 結果
   */
  isParren (val: string) {
    return val === '(' || val === ')'
  }
  /**
   * 検索対象が角括弧であるかどうか
   * @param val 対象の文字列
   * @returns 結果
   */
  isBracket (val: string) {
    return val === '[' || val === ']'
  }
  /**
   * 演算子に従った計算を行う
   * @param ope 演算子
   * @param val1 数値1(文字列)
   * @param val2 数値2(文字列)
   * @returns 計算結果
   */
  calculate (ope: string, val1: string, val2: string) {
    const num1 = Number(val1)
    const num2 = Number(val2)
    const getBaseLog = (x: number, y: number): number => {
      return Math.log(x) / Math.log(y)
    }
    switch (ope) {
      case '+':
        const x = new Big(num1)
        return x.plus(num2)
      case '-':
        return num2 - num1
      case '*':
        return num1 * num2
      case '/':
        return num2 / num1
      case '^':
        return num2 ** num1
      case '%':
        return num2 % num1
      case '_':
        return getBaseLog(num1, num2)
      default:
        return 0
    }
  }
  private factorialize (num: number) {
    if (num === 0) return 1
    return num * this.factorialize(num - 1)
  }
  specialCalc (ope: string, value: string) {
    const num = Number(value)
    switch (ope) {
      case 'sin':
        return Math.sin(num)
      case 'cos':
        return Math.cos(num)
      case 'tan':
        return Math.tan(num)
      case '!':
        return this.factorialize(num)
      case 'rad':
        return num * Math.PI / 180
      case 'abs':
        return Math.abs(num)
      case 'asin':
        return Math.asin(num)
      case 'acos':
        return Math.acos(num)
      case 'atan':
        return Math.atan(num)
      case 'ln':
        return Math.log(num)
      default:
        return 0
    }
  }
  /**
   * 対象によって異なる重みを返す
   * @param val 対象の文字
   * @returns 重要度
   */
  importanceNum (val: string) {
    if (this.isParren(val) || this.isBracket(val)) return 5
    if (val === '^' || val === '%' || val === '_') return 4
    if (val === '*' || val === '/') return 3
    if (val === '+' || val === '-') return 2
    else return 1
  }
}

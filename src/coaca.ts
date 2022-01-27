import { Calc } from './modules/coacaCalc.js'
import { Variable } from './modules/caocaVariable.js'
import { Convert } from './modules/coacaConvert.js'

export class Coaca {
  private calcClass: Calc
  private variableClass: Variable
  private convertClass: Convert

  constructor () {
    this.variableClass = new Variable()
    this.calcClass = new Calc(this.variableClass)
    this.convertClass = new Convert()
  }
  /**
   * 変数を生成します。変数名は宣言規則に従ってください。
   * @param {string} name 変数名
   * @param {number} value 初期値
   */
  createVariable (name: string, value: number) {
    try {
      this.variableClass.addVariable({
        name: name,
        value: value,
        isDefault: false
      })
    } catch (e) {
      console.error(e)
    }
  }
  /**
   * 変数名を変更します。
   * @param {string} name 変更する変数名
   * @param {number} value 変更値
   */
  changeVariable (name: string, value: number) {
    this.variableClass.changeVariable(name, value)
  }
  /**
   * 変数を削除します。
   * @param {string} name 削除する変数名
   */
  removeVariable (name: string) {
    this.variableClass.removeVariable(name)
  }
  /**
   * 計算式を追加します。記述方法については公式ドキュメントを参照してください。
   * @param formula {string} 計算式
   */
  setFormula (formula: string) {
    this.convertClass.setFormula(formula)
  }
  /**
   * RPNに変換をします。
   * @returns {array} RPNに変換された計算式を一つひとつ要素に格納した配列
   */
  convert (): string[] {
    return this.convertClass.convertToRPN()
  }
  /**
   * RPNに変換された配列から計算を行います。引数を取らない場合、そのクラスの計算式をRPNに変換し、計算を行います。引数を取る場合、その引数に従って計算を行います。
   * @param {array} rpnArr RPNに変換された配列
   * @returns {string} 計算結果
   */
  calc (rpnArr: string[] = null): string {
    let targetArr = rpnArr === null ? this.convert() : rpnArr
    this.calcClass.setRpnArr(targetArr)
    return this.calcClass.rpnCalc()
  }
}

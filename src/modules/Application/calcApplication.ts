import { CalcRepository } from "../domain/service/calcRepository.js"
import { Calc } from "../domain/model/calc.js"

export class CalcApplication {
  private calcRepository: CalcRepository
  constructor () {
    this.calcRepository = new CalcRepository()
  }
  /**
   * RPN配列をセットします。
   * @param {array} rpnArr RPN配列
   */
  setRpnArr (rpnArr: string[]) {
    this.calcRepository.save(rpnArr)
  }
  /**
   * 計算結果を文字列で渡します。
   *
   * なお、この関数は**確実に数値を返すとは限りません**。例えば"NaN"などを返す可能性もあります。
   *
   * @param {Array} rpnArr RPN配列
   * @returns {string} 計算結果
   */
  calc (rpnArr: string[] = null): string {
    if (rpnArr !== null) {
      this.setRpnArr(rpnArr)
    }
    const calc = new Calc(this.calcRepository.getRpnArr())
    return calc.rpnCalc()
  }
}
import { VariableRepository } from "../domainService/variableRepository.js";
import { Variable, IVariable } from "../domainModel/variable.js";

export class VariableApplication {
  private VariableRepository: VariableRepository
  constructor () {
    this.VariableRepository = new VariableRepository()
  }
  /**
   * 変数に代入する前のRPN配列に対して変数を代入します。
   *
   * @param {array} rpnArr RPN配列
   * @returns {array} 代入し終わったRPN配列
   */
  convertVariable (rpnArr: string[]): string[] {
    const variable = new Variable()
    const variableList = this.VariableRepository.getVariableList()
    return variable.convertVariable(rpnArr, variableList)
  }
  /**
   * 変数を新しく生成します。変数については[変数について](https://github.com/poyuaki/coaca.ts#%E5%A4%89%E6%95%B0%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)を参照してください。
   *
   * @param name 変数名
   * @param value 初期値
   */
  addVariable (name: string, value: number) {
    const variable = new Variable()
    const variableList = this.VariableRepository.getVariableList()
    const newVariableList: IVariable = {
      name,
      value,
      isDefault: false
    }
    variable.checkVariable(newVariableList, variableList)
    this.VariableRepository.save(newVariableList)
  }
  /**
   * 指定した変数を変更します。
   *
   * @param name 変数名
   * @param value 変更後の値
   */
   changeVariable (name: string ,value: number) {
    const variable = new Variable()
    const variableList = this.VariableRepository.getVariableList()
    variable.isDefaultVariable(name, variableList)
    this.VariableRepository.changeVariable(name, value)
  }
  /**
   * 指定した変数を削除します。
   *
   * @param name 変数名
   */
  removeVariable (name: string) {
    const variable = new Variable()
    const variableList = this.VariableRepository.getVariableList()
    variable.isDefaultVariable(name, variableList)
    this.VariableRepository.removeVariable(name)
  }
}
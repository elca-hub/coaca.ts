import { VariableRepository } from "../domainService/variableRepository.js";
import { Variable, IVariable } from "../domainModel/variable.js";

export class VariableApplication {
  private VariableRepository: VariableRepository
  constructor () {
    this.VariableRepository = new VariableRepository()
  }
  convertVariable (rpnArr: string[]) {
    const variable = new Variable()
    const variableList = this.VariableRepository.getVariableList()
    return variable.convertVariable(rpnArr, variableList)
  }
  addVariable (name: string, value: number) {
    const variable = new Variable()
    const variableList = this.VariableRepository.getVariableList()
    const newVariableList: IVariable = {
      name: name,
      value: value,
      isDefault: false
    }
    variable.checkVariable(newVariableList, variableList)
    this.VariableRepository.save(newVariableList)
  }
  /**
   * 指定した変数を変更する
   * @param name 変数名
   * @param value 変更後の値
   */
   changeVariable (name: string ,value: number) {
    this.VariableRepository.changeVariable(name, value)
  }
  /**
   * 指定した変数を削除する
   * @param name 変数名
   */
  removeVariable (name: string) {
    this.VariableRepository.removeVariable(name)
  }
}
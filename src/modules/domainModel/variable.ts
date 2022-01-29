import { FormulaControl } from "./formulaControl.js"

export class Variable {
  /**
   * 数式内に用いられている変数を代入
   * @param rpnArr RPN配列
   * @returns 変換後の配列
   */
  convertVariable (rpnArr: string[], variableList: IVariable[]) {
    let resArr: string[]
    resArr = rpnArr
    for (let i = 0; i < resArr.length; i++) {
      for (let k = 0; k < variableList.length; k++) {
        if (resArr[i] === variableList[k].name) {
          resArr[i] = String(variableList[k].value)
          break
        }
      }
    }
    return resArr
  }
  /**
   * 検索対象の文字列が変数として既に登録されているか
   * @param name 検索対象の文字列
   * @returns 変数の配列に存在するか
   */
  isInVariableList (name: string, variableList: IVariable[]) {
    for (let i = 0; i < variableList.length; i++) {
      if (variableList[i].name === name) return true
    }
    return false
  }
  checkVariable (newVariableList: IVariable, variableList: IVariable[]) {
    const isTrueVariableName = (name: string): boolean => {
      const fcClass = new FormulaControl()
      const isInOpeOrBra = (name: string): boolean => {
        for (let i = 0; i < name.length; i++) {
          const val: string = name.substring(i, i + 1)
          if (fcClass.isOperator(val) || fcClass.isBracket(val)) return true
        }
        return false
      }
      return !(name.length > 20 || isInOpeOrBra(name) || this.isInVariableList(name, variableList))
    }
    if (!isTrueVariableName(newVariableList.name)) {
      throw `The variable name "${newVariableList.name}" is not in the correct format.`
    }
  }
}

export interface IVariable {
  name: string,
  value: number,
  isDefault: boolean
}
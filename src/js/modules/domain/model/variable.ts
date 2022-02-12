import { FormulaControl } from "./formulaControl"

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
      variableList.forEach((variable) => {
        if (variable.name === resArr[i]) {
          resArr[i] = String(variable.value)
        }
      })
    }
    return resArr
  }
  /**
   * 検索対象の文字列が変数として既に登録されているか
   * @param name 検索対象の文字列
   * @returns 変数の配列に存在するか
   */
  isInVariableList (name: string, variableList: IVariable[]) {
    let flag = false
    variableList.forEach((variable) => {
      if (variable.name === name) flag = true
    })
    return flag
  }
  checkVariable (newVariableList: IVariable, variableList: IVariable[], isChange = false) {
    const isTrueVariableName = (name: string): boolean => {
      const fcClass = new FormulaControl()
      const isInOpeOrBra = (nameOpe: string): boolean => {
        for (let i = 0; i < nameOpe.length; i++) {
          const val: string = nameOpe.substring(i, i + 1)
          if (fcClass.isOperator(val) || fcClass.isParren(val) || fcClass.isBracket(val)) return true
        }
        return false
      }
      return !(name.length > 20 || isInOpeOrBra(name) || (this.isInVariableList(name, variableList) && !isChange))
    }
    const isNumber = (value: string): boolean => {
      const num = Number(value)
      if (isNaN(num)) return false
      return true
    }
    console.log(isNumber(newVariableList.value.toString()))
    if (!isTrueVariableName(newVariableList.name) || !isNumber(newVariableList.value.toString())) {
      throw new Error(`The variable name "${newVariableList.name}" is not in the correct format.`)
    }
  }
  isDefaultVariable(target: string, variableList: IVariable[]) {
    // 変数のisDefaultがtrueならthrow
    for (const variable of variableList) {
      if (variable.name === target && variable.isDefault) {
        throw new Error(`The variable "${target}" is a default variable.`)
      }
    }
  }
}

export interface IVariable {
  name: string,
  value: number,
  isDefault: boolean,
  id: number
}

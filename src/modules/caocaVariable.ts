import { FormulaControl } from "./coacaFormulaControl.js"

interface IVariable {
  name: string,
  value: number,
  isDefault: boolean
}

export class Variable {
  private variableList: IVariable[]
  constructor () {
    this.variableList = [
      {
        name: 'pie',
        value: Math.PI,
        isDefault: true
      },
      {
        name: 'e',
        value: Math.E,
        isDefault: true
      }
    ]
  }
  /**
   * 数式内に用いられている変数を代入
   * @param rpnArr RPN配列
   * @returns 変換後の配列
   */
  convertVariable (rpnArr: string[]) {
    let resArr: string[]
    resArr = rpnArr
    for (let i = 0; i < resArr.length; i++) {
      for (let k = 0; k < this.variableList.length; k++) {
        if (resArr[i] === this.variableList[k].name) {
          resArr[i] = String(this.variableList[k].value)
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
  isInVariableList (name: string) {
    for (let i = 0; i < this.variableList.length; i++) {
      if (this.variableList[i].name === name) return true
    }
    return false
  }
  /**
   * 新しく変数を追加する
   * @param newVariableList 新しく追加する配列のオブジェクト
   */
  addVariable (newVariableList: IVariable) {
    const isTrueVariableName = (name: string): boolean => {
      const fcClass = new FormulaControl()
      const isInOpeOrBra = (name: string): boolean => {
        for (let i = 0; i < name.length; i++) {
          const val: string = name.substring(i, i + 1)
          if (fcClass.isOperator(val) || fcClass.isBracket(val)) return true
        }
        return false
      }
      return !(name.length > 20 || isInOpeOrBra(name) || this.isInVariableList(name))
    }
    if (isTrueVariableName(newVariableList.name)) {
      this.variableList.push(newVariableList)
    } else {
      throw `The variable name "${newVariableList.name}" is not in the correct format.`
    }
  }
  /**
   * 指定した変数を変更する
   * @param name 変数名
   * @param value 変更後の値
   */
  changeVariable (name: string ,value: number) {
    this.variableList.forEach(item => {
      if (item.name === name) item.value = value
    })
  }
  /**
   * 指定した変数を削除する
   * @param name 変数名
   */
  removeVariable (name: string) {
    this.variableList = this.variableList.filter(item => item.name !== name || item.isDefault)
  }
}
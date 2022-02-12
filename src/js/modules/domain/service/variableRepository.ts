import {IVariable} from  '../model/variable'

export class VariableRepository {
  variableList: IVariable[]
  constructor () {
    this.variableList = [
      {
        name: 'pie',
        value: Math.PI,
        isDefault: true,
        id: 0
      },
      {
        name: 'e',
        value: Math.E,
        isDefault: true,
        id: 1
      },
      {
        name: 'K',
        value: 1000,
        isDefault: true,
        id: 2
      },
      {
        name: 'M',
        value: 1000000,
        isDefault: true,
        id: 3
      },
      {
        name: 'G',
        value: 1000000000,
        isDefault: true,
        id: 4
      },
      {
        name: 'm',
        value: 0.001,
        isDefault: true,
        id: 5
      },
      {
        name: 'μ',
        value: 0.000001,
        isDefault: true,
        id: 6
      },
      {
        name: 'n',
        value: 0.000000001,
        isDefault: true,
        id: 7
      }
    ]
  }
  public save (variableObj: IVariable) {
    this.variableList.push(variableObj)
    this.setLocalStrorage(this.findNotDefaultVariable())
  }
  public findByName (name: string) {
    return this.variableList.find((item) => item.name === name)
  }
  public findNotDefaultVariable () {
    return this.variableList.filter((item) => !item.isDefault)
  }
  public findById (id: number) {
    return this.variableList.find((item) => item.id === id)
  }
  public getVariableList () {
    return this.variableList
  }
  /**
   * 指定した変数を変更する
   * @param name 変更後の名前
   * @param value 変更後の値
   * @param id 変数のID
   */
   changeVariable (name: string ,value: number, id: number) {
    const variable = this.findById(id)
    variable.name = name
    variable.value = value
    this.setLocalStrorage(this.findNotDefaultVariable())
  }
  /**
   * 指定した変数を削除する
   * @param name 変数名
   */
  removeVariable (id: number) {
    this.variableList = this.variableList.filter((item) => item.id !== id)
    this.setLocalStrorage(this.findNotDefaultVariable())
  }
  getNewId (): number {
    // variableListの中で最大のidを取得する
    const maxId = this.variableList.reduce((max, item) => {
      return item.id > max ? item.id : max
    }
    , 0)
    return maxId + 1
  }

  private setLocalStrorage (variableList: IVariable[]) {
    // localStorageにvaiablelistがあれば削除する
    if (localStorage.getItem('variableList')) {
      localStorage.removeItem('variableList')
    }
    // localStorageにvariableListを保存する
    localStorage.setItem('variableList', JSON.stringify(variableList))
  }

  public getLocalStorage () {
    return JSON.parse(localStorage.getItem('variableList'))
  }
}

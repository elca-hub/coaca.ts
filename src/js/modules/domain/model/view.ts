import {IVariable} from  '../model/variable'

export class View {
  createInput (placeholder: string, type: string, classList: string[], id: string) {
    const inputDom = document.createElement('input')
    inputDom.setAttribute('type', type)
    inputDom.setAttribute('placeholder', placeholder)
    inputDom.classList.add(...classList)
    inputDom.setAttribute('id', id)
    return inputDom
  }
  /**
   * アラートに表示するDOM要素を返す。
   * このメソッドでは、以下の要素を含むdiv要素を返す。
   * - 変数名を入力するinput要素
   * - 変数の値を入力するinput要素
   * - 確定ボタンを構成するdiv要素
   *   - 確定ボタンのテキストはspan要素
   * - キャンセルボタンを構成するdiv要素
   *   - キャンセルボタンのテキストはspan要素
   *
   * @memberof View
   */
  cretateInputVariable (viewDeleteButton: boolean = false) {
    /* 全ての親 */
    const inputVariableDom = document.createElement('div')
    inputVariableDom.classList.add('input-variable-box')

    /* 変数の名前、変数の値を入力するためのDIV親 */
    const inputBoxDom = document.createElement('div')
    inputBoxDom.classList.add('input-variable-button-box')

    const inputVariableNameDivDom = document.createElement('div')
    inputVariableNameDivDom.classList.add('input-variable-name-box')
    const inputVariableValueDivDom = document.createElement('div')
    inputVariableValueDivDom.classList.add('input-variable-value-box')
    const inputVariableNameDom = this.createInput('変数名', 'text', ['input-variable-name', 'input-variable-form'], 'inputVariableName') // 変数名を入力するinput要素
    const inputVariableValueDom = this.createInput('値', 'text', ['input-variable-value', 'input-variable-form'], 'inputVariableValue') // 変数の値を入力するinput要素
    inputVariableNameDivDom.appendChild(inputVariableNameDom)
    inputVariableValueDivDom.appendChild(inputVariableValueDom)
    inputBoxDom.appendChild(inputVariableNameDivDom)
    inputBoxDom.appendChild(inputVariableValueDivDom)

    let deleteVariableButtonDivDom = null
    if (viewDeleteButton) {
      deleteVariableButtonDivDom = document.createElement('div')
      deleteVariableButtonDivDom.classList.add('delete-variable-button-box')
      const deleteVariableButtonDom = document.createElement('div')
      deleteVariableButtonDom.classList.add('delete-variable-button')
      deleteVariableButtonDom.innerText = '削除'
      deleteVariableButtonDom.id = 'deleteVariableButton'
      deleteVariableButtonDivDom.appendChild(deleteVariableButtonDom)
    }

    /* 確定ボタン、キャンセルボタンを含むDIV親 */
    const inputVariableButtonDom = document.createElement('div')
    inputVariableButtonDom.classList.add('input-variable-button')

    /* 確定ボタンdiv */
    const inputVariableButtonConfirmDom = document.createElement('div')
    inputVariableButtonConfirmDom.classList.add('input-variable-button-confirm')

    /* 確定ボタンのテキスト */
    const inputVariableButtonConfirmTextDom = document.createElement('span')
    inputVariableButtonConfirmTextDom.classList.add('input-variable-button-confirm-text')
    inputVariableButtonConfirmTextDom.innerText = '確定'
    inputVariableButtonConfirmTextDom.setAttribute('id', 'variableConfirm')
    inputVariableButtonConfirmDom.appendChild(inputVariableButtonConfirmTextDom)

    /* キャンセルボタンdiv */
    const inputVariableButtonCancelDom = document.createElement('div')
    inputVariableButtonCancelDom.classList.add('input-variable-button-cancel')

    /* キャンセルボタンのテキスト */
    const inputVariableButtonCancelTextDom = document.createElement('span')
    inputVariableButtonCancelTextDom.classList.add('input-variable-button-cancel-text')
    inputVariableButtonCancelTextDom.innerText = 'キャンセル'
    inputVariableButtonCancelTextDom.setAttribute('id', 'variableCancel')
    inputVariableButtonCancelDom.appendChild(inputVariableButtonCancelTextDom)

    inputVariableButtonDom.appendChild(inputVariableButtonConfirmDom)
    inputVariableButtonDom.appendChild(inputVariableButtonCancelDom)

    inputVariableDom.appendChild(inputBoxDom)
    if (viewDeleteButton) inputVariableDom.appendChild(deleteVariableButtonDivDom)
    inputVariableDom.appendChild(inputVariableButtonDom)

    return inputVariableDom
  }

  public createVariableList (variableList: IVariable[]) {
    /* 変数リストの親 */
    const variableListDom = document.getElementById('variableList')
    variableListDom.innerHTML = ''

    for (const variable of variableList) {
      /* 変数リストのアイテム */
      const variableDom = document.createElement('div')
      variableDom.classList.add('variable-list-item')
      variableDom.setAttribute('id', this.getVariableListItemId(variable.id))

      /* 変数名 */
      const variableNameDom = document.createElement('div')
      variableNameDom.classList.add('variable-list-item-name')
      variableNameDom.innerText = variable.name

      /* 変数の値 */
      const variableValueDom = document.createElement('div')
      variableValueDom.classList.add('variable-list-item-value')
      variableValueDom.innerText = variable.value.toString()

      variableDom.appendChild(variableNameDom)
      variableDom.appendChild(variableValueDom)

      variableListDom.appendChild(variableDom)
    }
  }

  public getVariableListItemId (id: number) {
    return `variableListItem-${id}`
  }
}

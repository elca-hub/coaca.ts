import $ from 'jquery'

import { ViewRepository } from '../domain/service/viewRepository'
import { View } from '../domain/model/view'
import { VariableApplication } from './variableApplication'
import { VariableRepository } from '../domain/service/variableRepository'
import { IVariable } from '../domain/model/variable'
import { IDescription } from '../domain/model/view'

export class ViewApplication {
  private fadeTime: number // フェードにかかる時間ms
  private viewRepository: ViewRepository
  private parentDom: HTMLElement // アラートの親DOM要素
  private parentDomId: string // アラートのID
  constructor (fadeTime: number = null) {
    this.fadeTime = fadeTime === null ? 1000 : fadeTime
    this.viewRepository = new ViewRepository()
    this.parentDomId = 'alertContent'
    this.parentDom = document.getElementById(this.parentDomId)
  }
  createVariableInput (variable: VariableApplication) {
    const view = new View()
    this.breakAlert()
    this.cretateAlert(view.cretateInputVariable())
    document.getElementById('variableCancel').addEventListener('click', () => { this.hideAlert() })
    document.getElementById('variableConfirm').addEventListener('click', () => {
      const nameEle = document.getElementById('inputVariableName') as HTMLInputElement
      const valEle = document.getElementById('inputVariableValue') as HTMLInputElement
      variable.addVariable(nameEle.value, Number(valEle.value))
      this.hideAlert()
      this.viewVariableList(variable.getRepository(), variable)
    })
  }
  createChangeVariableInput (variable: VariableApplication, id: number) {
    const view = new View()
    this.breakAlert()
    this.cretateAlert(view.cretateInputVariable(true))
    this.setVaribaleInput(variable.getRepository().findById(id))
    document.getElementById('variableCancel').addEventListener('click', () => { this.hideAlert() })
    document.getElementById('variableConfirm').addEventListener('click', () => {
      const nameEle = document.getElementById('inputVariableName') as HTMLInputElement
      const valEle = document.getElementById('inputVariableValue') as HTMLInputElement
      variable.changeVariable(nameEle.value, Number(valEle.value), id)
      this.hideAlert()
      this.viewVariableList(variable.getRepository(), variable)
    })
    document.getElementById('deleteVariableButton').addEventListener('click', () => {
      variable.removeVariable(id, variable.getRepository().findById(id).name)
      this.hideAlert()
      this.viewVariableList(variable.getRepository(), variable)
    })
  }
  /**
   * アラート内容のDOMを生成する
   * @param dom 表示させるDOM
   */
  cretateAlert (dom: HTMLElement) {
    this.parentDom.appendChild(dom)
  }
  /**
   * アラート内容のDOMを削除する
   */
  breakAlert () {
    this.parentDom.innerHTML = ''
    this.viewRepository.setIsAlertShow(false)
  }
  async showAlert (isBlur: boolean = true) {
    if (isBlur) {
      console.log(this.viewRepository.getCssStyle('background-color'))
      $(`#${this.parentDomId}`).css({
        'backdrop-filter': this.viewRepository.getCssStyle('backdrop-filter'),
        'background-color': this.viewRepository.getCssStyle('background-color')
      })
    } else {
      $(`#${this.parentDomId}`).css({
        'backdrop-filter': 'blur(0px)',
        'background': 'rgba(0, 0, 0, 0)'
      })
    }
    $(`#${this.parentDomId}`).fadeIn(this.fadeTime)
    await new Promise((r) => setTimeout(r, this.fadeTime))
    this.viewRepository.setIsAlertShow(true)
  }
  async hideAlert () {
    $(`#${this.parentDomId}`).fadeOut(this.fadeTime)
    await new Promise((r) => setTimeout(r, this.fadeTime))
    this.breakAlert()
    this.viewRepository.setIsAlertShow(false)
  }

  setVaribaleInput (iv: IVariable) {
    try {
      const nameEle = document.getElementById('inputVariableName') as HTMLInputElement
      const valEle = document.getElementById('inputVariableValue') as HTMLInputElement
      nameEle.value = iv.name
      valEle.value = iv.value.toString()
    } catch (e) {
      console.error(e)
    }
  }

  viewVariableList (vr: VariableRepository, va: VariableApplication) {
    const variableList = vr.findNotDefaultVariable() // 変数のリストを取得
    const view = new View()
    view.createVariableList(variableList)
    for (const v of variableList) {
      const id = v.id
      const variableItemEle = document.getElementById(view.getVariableListItemId(id)) as HTMLElement // 変数のDOM要素
      variableItemEle.addEventListener('click', () => {
        this.createChangeVariableInput(va, id)
        this.showAlert()
      })
    }
  }

  viewDescription (descriptionData: IDescription[]) {
    const view = new View()
    view.createDescription(descriptionData)
  }

  hideToast (time: number) {
    setTimeout(() => {
      this.hideAlert()
    }, time)
  }

  viewToast (title: string, des: string) {
    const view = new View()
    this.cretateAlert(view.createToast({ title, des }, this))
    this.showAlert(false)
    // this.hideToast(3000)
  }
}

import $ from 'jquery'

import { ViewRepository } from '../domain/service/viewRepository'
import { View } from '../domain/model/view'
import { VariableApplication } from './variableApplication'

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
    this.cretateAlert(view.cretateInputVariable())
    document.getElementById('variableCancel').addEventListener('click', () => { this.hideAlert() })
    document.getElementById('variableConfirm').addEventListener('click', () => {
      const nameEle = document.getElementById('inputVariableName') as HTMLInputElement
      const valEle = document.getElementById('inputVariableValue') as HTMLInputElement
      variable.addVariable(nameEle.value, Number(valEle.value))
      this.hideAlert()
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
  }
  async showAlert () {
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
}

export class ViewRepository {
  private isAlertShow: boolean
  constructor() {
    this.isAlertShow = document.getElementById('alertContent').style.display !== 'none'
  }
  setIsAlertShow (isAlertShow: boolean) {
    this.isAlertShow = isAlertShow
  }
  getIsAlertShow (): boolean {
    return this.isAlertShow
  }
}

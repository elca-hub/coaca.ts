import $ from 'jquery'

export class ViewRepository {
  private isAlertShow: boolean
  private styleSheet: {}
  constructor() {
    this.isAlertShow = document.getElementById('alertContent').style.display !== 'none'
    window.addEventListener("load", () => {
      this.styleSheet = $('#alertContent').css(['background-color', 'backdrop-filter']) // 初期のスタイルを取得();
    })
  }
  setIsAlertShow (isAlertShow: boolean) {
    this.isAlertShow = isAlertShow
  }
  getIsAlertShow (): boolean {
    return this.isAlertShow
  }
  getCssStyle (prop: string): string {
    return this.styleSheet[prop]
  }
}

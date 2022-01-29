export class CalcRepository {
  rpnArr: string[]
  constructor () {
    this.rpnArr = []
  }
  save (rpnArr: string[]) {
    this.rpnArr = rpnArr
  }
  getRpnArr (): string[] {
    return this.rpnArr
  }
}

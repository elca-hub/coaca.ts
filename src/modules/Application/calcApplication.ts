import { calcRepository } from "../domainService/calcRepository.js"
import { Calc } from "../domainModel/calc.js"

export class CalcApplication {
  private calcRepository: calcRepository
  constructor () {
    this.calcRepository = new calcRepository()
  }
  setRpnArr (rpnArr: string[]) {
    this.calcRepository.save(rpnArr)
  }
  calc (rpnArr: string[] = null): string {
    if (rpnArr !== null) {
      this.setRpnArr(rpnArr)
    }
    const calc = new Calc(this.calcRepository.getRpnArr())
    return calc.rpnCalc()
  }
}
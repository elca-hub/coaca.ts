import { ConvertRepository } from "../domainService/convertRepository.js";
import { Convert } from "../domainModel/convert.js";

export class ConvertApplication {
  private convertRepository: ConvertRepository
  constructor () {
    this.convertRepository = new ConvertRepository()
  }
  setFormula (formula: string) {
    this.convertRepository.save(formula)
  }
  convertRpn (): string[] {
    const convert = new Convert(this.convertRepository.getFormula())
    return convert.convertToRPN()
  }
}
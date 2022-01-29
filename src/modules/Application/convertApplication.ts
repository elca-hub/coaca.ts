import { ConvertRepository } from "../domainService/convertRepository.js";
import { Convert } from "../domainModel/convert.js";

export class ConvertApplication {
  private convertRepository: ConvertRepository
  constructor () {
    this.convertRepository = new ConvertRepository()
  }
  /**
   * 計算式をセットします。計算式の演算子については[演算子について](https://github.com/poyuaki/coaca.ts#%E6%BC%94%E7%AE%97%E5%AD%90%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)を参照してください。
   * 
   * @param formula 計算式
   */
  setFormula (formula: string) {
    this.convertRepository.save(formula)
  }
  /**
   * RPN配列を返します。
   * @returns {array} RPN配列
   */
  convertRpn (): string[] {
    const convert = new Convert(this.convertRepository.getFormula())
    return convert.convertToRPN()
  }
}
export class ConvertRepository {
  private formula: string
  constructor () {
    this.formula = ''
  }
  save (formula: string) {
    this.formula = formula
  }
  getFormula (): string {
    return this.formula
  }
}
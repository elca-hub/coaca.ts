export class ConvertRepository {
    constructor() {
        this.formula = '';
    }
    save(formula) {
        this.formula = formula;
    }
    getFormula() {
        return this.formula;
    }
}

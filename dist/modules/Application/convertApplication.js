import { ConvertRepository } from "../domainService/convertRepository.js";
import { Convert } from "../domainModel/convert.js";
export class ConvertApplication {
    constructor() {
        this.convertRepository = new ConvertRepository();
    }
    setFormula(formula) {
        this.convertRepository.save(formula);
    }
    convertRpn() {
        const convert = new Convert(this.convertRepository.getFormula());
        return convert.convertToRPN();
    }
}

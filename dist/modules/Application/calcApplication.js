import { calcRepository } from "../domainService/calcRepository.js";
import { Calc } from "../domainModel/calc.js";
export class CalcApplication {
    constructor() {
        this.calcRepository = new calcRepository();
    }
    setRpnArr(rpnArr) {
        this.calcRepository.save(rpnArr);
    }
    calc(rpnArr = null) {
        if (rpnArr !== null) {
            this.setRpnArr(rpnArr);
        }
        const calc = new Calc(this.calcRepository.getRpnArr());
        return calc.rpnCalc();
    }
}

import { FormulaControl } from "./formulaControl.js";
export class Calc {
    constructor(rpnArr) {
        this.rpnArr = rpnArr;
    }
    /**
     * RPN配列に格納されている数式を基に計算を行う
     * @returns 計算結果(文字列)
     */
    rpnCalc() {
        let stack = [];
        let fcClass = new FormulaControl();
        this.rpnArr.forEach(val => {
            if (!fcClass.isOperator(val))
                stack.push(val);
            else
                stack.push(String(fcClass.calculate(val, stack.pop(), stack.pop())));
        });
        return stack[0];
    }
}

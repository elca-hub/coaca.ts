export class FormulaControl {
    constructor() {
        this.operatorList = ['+', '-', '*', '/', '^', '_', '%'];
    }
    /**
     * 検索対象が演算子であるかどうか
     * @param val 検索対象の文字
     * @returns 結果
     */
    isOperator(val) {
        return this.operatorList.indexOf(val) !== -1;
    }
    /**
     * 検索対象が丸括弧であるかどうか
     * @param val 検索対象の文字列
     * @returns 結果
     */
    isBracket(val) {
        return val === '(' || val === ')';
    }
    /**
     * 演算子に従った計算を行う
     * @param ope 演算子
     * @param val1 数値1(文字列)
     * @param val2 数値2(文字列)
     * @returns 計算結果
     */
    calculate(ope, val1, val2) {
        let num1 = Number(val1);
        let num2 = Number(val2);
        let getBaseLog = (x, y) => {
            return Math.log(x) / Math.log(y);
        };
        switch (ope) {
            case '+':
                return num1 + num2;
            case '-':
                return num2 - num1;
            case '*':
                return num1 * num2;
            case '/':
                return num2 / num1;
            case '^':
                return num2 ** num1;
            case '%':
                return num2 % num1;
            case '_':
                return getBaseLog(num1, num2);
            default:
                return 0;
        }
    }
    /**
     * 対象によって異なる重みを返す
     * @param val 対象の文字
     * @returns 重要度
     */
    importanceNum(val) {
        if (this.isBracket(val))
            return 5;
        if (val === '^' || val === '%' || val === '_')
            return 4;
        if (val === '*' || val === '/')
            return 3;
        if (val === '+' || val === '-')
            return 2;
        else
            return 1;
    }
}

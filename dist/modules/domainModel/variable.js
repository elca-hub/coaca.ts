import { FormulaControl } from "./formulaControl.js";
export class Variable {
    /**
     * 数式内に用いられている変数を代入
     * @param rpnArr RPN配列
     * @returns 変換後の配列
     */
    convertVariable(rpnArr, variableList) {
        let resArr;
        resArr = rpnArr;
        for (let i = 0; i < resArr.length; i++) {
            for (let k = 0; k < variableList.length; k++) {
                if (resArr[i] === variableList[k].name) {
                    resArr[i] = String(variableList[k].value);
                    break;
                }
            }
        }
        return resArr;
    }
    /**
     * 検索対象の文字列が変数として既に登録されているか
     * @param name 検索対象の文字列
     * @returns 変数の配列に存在するか
     */
    isInVariableList(name, variableList) {
        for (let i = 0; i < variableList.length; i++) {
            if (variableList[i].name === name)
                return true;
        }
        return false;
    }
    checkVariable(newVariableList, variableList) {
        const isTrueVariableName = (name) => {
            const fcClass = new FormulaControl();
            const isInOpeOrBra = (name) => {
                for (let i = 0; i < name.length; i++) {
                    const val = name.substring(i, i + 1);
                    if (fcClass.isOperator(val) || fcClass.isParren(val) || fcClass.isBracket(val) || fcClass.isSpecialOperator(val))
                        return true;
                }
                return false;
            };
            return !(name.length > 20 || isInOpeOrBra(name) || this.isInVariableList(name, variableList));
        };
        if (!isTrueVariableName(newVariableList.name)) {
            throw `The variable name "${newVariableList.name}" is not in the correct format.`;
        }
    }
    isDefaultVariable(target, variableList) {
        // 変数のisDefaultがtrueならthrow
        for (let i = 0; i < variableList.length; i++) {
            if (variableList[i].name === target && variableList[i].isDefault) {
                throw `The default variable "${target}" can not be actioned.`;
            }
        }
    }
}

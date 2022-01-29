import { VariableRepository } from "../domainService/variableRepository.js";
import { Variable } from "../domainModel/variable.js";
export class VariableApplication {
    constructor() {
        this.VariableRepository = new VariableRepository();
    }
    convertVariable(rpnArr) {
        const variable = new Variable();
        const variableList = this.VariableRepository.getVariableList();
        return variable.convertVariable(rpnArr, variableList);
    }
    addVariable(name, value) {
        const variable = new Variable();
        const variableList = this.VariableRepository.getVariableList();
        const newVariableList = {
            name: name,
            value: value,
            isDefault: false
        };
        variable.checkVariable(newVariableList, variableList);
        this.VariableRepository.save(newVariableList);
    }
    /**
     * 指定した変数を変更する
     * @param name 変数名
     * @param value 変更後の値
     */
    changeVariable(name, value) {
        const variable = new Variable();
        const variableList = this.VariableRepository.getVariableList();
        variable.isDefaultVariable(name, variableList);
        this.VariableRepository.changeVariable(name, value);
    }
    /**
     * 指定した変数を削除する
     * @param name 変数名
     */
    removeVariable(name) {
        const variable = new Variable();
        const variableList = this.VariableRepository.getVariableList();
        variable.isDefaultVariable(name, variableList);
        this.VariableRepository.removeVariable(name);
    }
}

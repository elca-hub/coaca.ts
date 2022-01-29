export class VariableRepository {
    constructor() {
        this.variableList = [
            {
                name: 'pie',
                value: Math.PI,
                isDefault: true
            },
            {
                name: 'e',
                value: Math.E,
                isDefault: true
            },
            {
                name: 'K',
                value: 1000,
                isDefault: true
            },
            {
                name: 'M',
                value: 1000000,
                isDefault: true
            },
            {
                name: 'G',
                value: 1000000000,
                isDefault: true
            },
            {
                name: 'm',
                value: 0.001,
                isDefault: true
            },
            {
                name: 'μ',
                value: 0.000001,
                isDefault: true
            },
            {
                name: 'n',
                value: 0.000000001,
                isDefault: true
            }
        ];
    }
    save(variableObj) {
        this.variableList.push(variableObj);
    }
    findByName(name) {
        return this.variableList.find(item => item.name === name);
    }
    getVariableList() {
        return this.variableList;
    }
    /**
     * 指定した変数を変更する
     * @param name 変数名
     * @param value 変更後の値
     */
    changeVariable(name, value) {
        this.variableList.forEach(item => {
            if (item.name === name)
                item.value = value;
        });
    }
    /**
     * 指定した変数を削除する
     * @param name 変数名
     */
    removeVariable(name) {
        this.variableList = this.variableList.filter(item => item.name !== name || item.isDefault);
    }
}

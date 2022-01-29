export class calcRepository {
    constructor() {
        this.rpnArr = [];
    }
    save(rpnArr) {
        this.rpnArr = rpnArr;
    }
    getRpnArr() {
        return this.rpnArr;
    }
}

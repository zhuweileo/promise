function resolve(result) {
    setTimeout(() => {
        this.stack.forEach(({ success, fail }) => {
            if (typeof success === 'function') success(result);
        })
    })
}
function reject(reason) {
    setTimeout(() => {
        this.stack.forEach(({ success, fail }) => {
            if (typeof fail === 'function') fail(reason);
        })
    })
}
export class Promise2 {
    static PENDING = 'PENDING'
    static FULLFILLED = 'FULLFILLED'
    static REJECTED = 'REJECTED'

    constructor(fun) {
        if (typeof fun !== 'function') {
            throw new Error('Promise参数必须是一个函数');
        }
        fun(resolve.bind(this), reject.bind(this));
    }

    stack = []

    state = Promise2.PENDING

    then(success?, fail?) {
        this.stack.push({
            success,
            fail
        })
    }
}
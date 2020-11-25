function resolve(result) {
    if(this.state !== Promise2.PENDING) return;
    this.state = Promise2.FULLFILLED;
    setTimeout(() => {
        this.stack.forEach(({ success, fail }) => {
            if (typeof success === 'function') 
                success(result);
        })
    })
}
function reject(reason) {
    if(this.state !== Promise2.PENDING) return;
    this.state = Promise2.REJECTED;
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

    private stack = []

    private state = Promise2.PENDING

    then(success?, fail?) {
        const promise2 = new Promise2(function (resolve, reject) {});
        this.stack.push({
            // success: success.bind(),
            // fail: fail.bind(),
            success,
            fail,
            nextPromise: promise2
        })

        return promise2;
    }
}

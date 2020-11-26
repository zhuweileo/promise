function resolve(result) {
    if (this.state !== Promise2.PENDING) return;
    this.state = Promise2.FULLFILLED;
    setTimeout(() => {
        this.stack.forEach(({ success, fail, promise2 }) => {
            if (typeof success !== 'function') {
                resolve.call(promise2, result);
                return
            }
            try {
                const res = success(result);
                
                resolveWith(promise2, res);
            } catch (err) {
                reject.call(promise2, err);
            }
        })
    },0)
}

function reject(reason) {
    if (this.state !== Promise2.PENDING) return;
    this.state = Promise2.REJECTED;
    setTimeout(() => {
        this.stack.forEach(({ success, fail, promise2 }) => {
            if (typeof fail !== 'function') {
                resolve.call(promise2, reason);
                return
            }
            try {
                const res = fail(reason);
                resolveWith(promise2, res);
            } catch (err) {
                reject.call(promise2, err);
            }
        })
    },0)
}

function resolveWith(promise, x) {
    if (promise === x) {
        reject.call(promise, new TypeError(''));
    } else if (x instanceof Promise2) {
        
        x.then((result) => {
            resolve.call(promise, result)
        }, (reason) => {
            reject.call(promise, reason)
        });
    } else if (typeof x === 'object') {
        let then
        try {
            // 因为then可能是一个 get 属性，所以有可能报错
            then = x.then;
            if (typeof then === 'function') {
                try {
                    then.call(x, (result) => {
                        resolveWith(promise, result)
                    }, (reason) => {
                        reject.call(promise, reason)
                    });
                } catch (err) {
                    reject.call(promise, err)
                }
            } else {
                resolve.call(promise, x);
            }
        } catch (err) {
            reject.call(promise, err);
        }
    } else {
        resolve.call(promise, x);
    }
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
        const promise2 = new Promise2(() => { });
        this.stack.push({
            success,
            fail,
            promise2
        })

        return promise2;
    }
}

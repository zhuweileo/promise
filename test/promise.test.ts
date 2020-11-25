import * as chai from 'chai';
import * as sinon from 'sinon';
import { Promise2 } from '../promise';

const assert = chai.assert;

describe('promise', function () {
    it('是一个类', function () {
        // @ts-ignore
        assert.isFunction(Promise2);
        assert.isObject(Promise2.prototype);
    })

    it('new Promise()必须接收一个函数', function () {
        assert.throw(() => {
            // @ts-ignore
            new Promise2();
        })
    })

    it('接受的函数立即执行, 参数是两个函数', function () {
        const fun = sinon.fake();
        new Promise2(fun);
        assert(fun.called);

        new Promise2(function (resolve, reject) {
            assert.isFunction(resolve);
            assert.isFunction(reject);
        });
    })

    it('new Promise(fn)会生成一个有then方法的对象', function () {
        const promise = new Promise2(() => { });
        assert.isObject(promise)
        assert.isFunction(promise.then);
    })

    it(`promise.then(success)中的success会在resolve被调用后的时候执行
        并将promise的结果作为第一个参数;
        调用不能超过一次;
    `, 
    function (done) {
        const success = sinon.fake();
        const promise = new Promise2((resolve, reject) => {
            assert.isFalse(success.called);
            resolve(222);
            resolve(222);
            setTimeout(function () {
                assert(success.calledWith(222));
                assert(success.calledOnce);
                done();
            })
        }).then(success)

    })

    it(`promise.then(null,fail)中的fail会在reject被调用的时候执行
        并将promise的 错误原因 作为第一个参数;
        调用不能超过一次;
    `, 
    function (done) {
        const fail = sinon.fake();
        const promise = new Promise2((resolve, reject) => {
            assert.isFalse(fail.called);
            reject(233);
            reject(233);
            setTimeout(function () {
                assert(fail.calledWith(233));
                assert(fail.calledOnce);
                done();
            })
        }).then(null, fail)
    })

    it('2.2.5 fail 不应包含this', function (done) {
        const promise = new Promise2((resolve, reject) => {
            resolve();
        }).then(function () {
            assert(this === undefined);
            done();
        })

    })

    it('2.2.5  fail 不应包含this', function (done) {
        const promise2 = new Promise2((resolve, reject) => {
            reject();
        }).then(null, function () {
            assert(this === undefined);
            done();
        })
    })

    it('2.2.6 then可以被重复调用', function (done) {
        const fun1 = sinon.fake();
        const fun2 = sinon.fake();
        const fun3 = sinon.fake();
        const promise = new Promise2(function (resolve, reject) {
            resolve();
        })
        promise.then(fun1)
        promise.then(fun2)
        promise.then(fun3)

        setTimeout(function () {
            assert(fun1.called);
            assert(fun1.calledBefore(fun2))
            assert(fun2.called);
            assert(fun2.calledBefore(fun3))
            assert(fun3.called);
            done()
        })
    })
    it('2.2.6 then可以被重复调用', function (done) {
        const fun1 = sinon.fake();
        const fun2 = sinon.fake();
        const fun3 = sinon.fake();
        const promise = new Promise2(function (resolve, reject) {
            reject();
        })
        promise.then(null,fun1)
        promise.then(null,fun2)
        promise.then(null,fun3)

        setTimeout(function () {
            assert(fun1.called);
            assert(fun1.calledBefore(fun2))
            assert(fun2.called);
            assert(fun2.calledBefore(fun3))
            assert(fun3.called);
            done()
        })
    })

    it('2.2.7 then返回一个promsise', function () {
        const promise = new Promise2(function () {}).then();
        assert(promise instanceof Promise2);
    })
    
    it('')

})
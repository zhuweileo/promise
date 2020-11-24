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

    it('promise.then(success)中的success会在resolve被调用的时候执行', function (done) {
        const success = sinon.fake();
        const promise = new Promise2((resolve, reject) => {
            resolve(222);
            setTimeout(function () {
                assert(success.calledWith(222));
                done();
            })
        }).then(success)

    })

    it('promise.then(null,fail)中的fail会在reject被调用的时候执行', function (done) {
        const fail = sinon.fake();
        const promise = new Promise2((resolve, reject) => {
            reject(233);
            setTimeout(function () {
                assert(fail.calledWith(233));
                done();
            })
        }).then(null, fail)

    })


})
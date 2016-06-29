'use strict';
const assert = require('chai').assert;
const Executor = require('../index');

describe('index test', () => {
    let instance;

    beforeEach(() => {
        instance = new Executor({ foo: 'bar' });
    });

    afterEach(() => {
        instance = null;
    });

    it('can create a Executor base class', () => {
        assert.instanceOf(instance, Executor);
    });

    it('has methods that need to be extended', () => {
        assert.throws(instance.start, Error, 'not implemented');
        assert.throws(instance.stop, Error, 'not implemented');
    });

    it('can be extended', (done) => {
        class Foo extends Executor {
            get(id, callback) {
                if (id > 0) {
                    return callback(null, { id });
                }

                return process.nextTick(() => {
                    callback(new Error('invalid id'));
                });
            }
        }

        const bar = new Foo({ foo: 'bar' });

        assert.instanceOf(bar, Executor);
        bar.get(1, (err, data) => {
            assert.isNull(err);
            assert.equal(data.id, 1);
            done();
        });
    });
});

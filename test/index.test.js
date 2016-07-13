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

    it('start returns an error when not overridden', (done) => {
        instance.start({}, (err) => {
            assert.isOk(err, 'error is null');
            done();
        });
    });

    it('start returns an error when not implemented', (done) => {
        const config = {
            buildId: 'a',
            jobId: 'a',
            pipelineId: 'a',
            container: 'a',
            scmUrl: 'a'
        };

        instance.start(config, (err) => {
            assert.isOk(err, 'err is null');
            assert.equal(err.message, 'not implemented');
            done();
        });
    });

    it('stop returns an error when not overridden', (done) => {
        instance.stop({}, (err) => {
            assert.isOk(err, 'error is null');
            done();
        });
    });

    it('stop returns an error when not implemented', (done) => {
        const config = {
            buildId: 'a',
            jobId: 'a',
            pipelineId: 'a',
            container: 'a',
            scmUrl: 'a'
        };

        instance.stop(config, (err) => {
            assert.isOk(err, 'err is null');
            assert.equal(err.message, 'not implemented');
            done();
        });
    });

    it('stream returns an error when not overridden', (done) => {
        instance.stream({}, (err) => {
            assert.isOk(err, 'error is null');
            done();
        });
    });

    it('stream returns an error when not implemented', (done) => {
        const config = {
            buildId: 'a'
        };

        instance.stream(config, (err) => {
            assert.isOk(err, 'err is null');
            assert.equal(err.message, 'not implemented');
            done();
        });
    });

    it('can be extended', (done) => {
        class Foo extends Executor {
            _stream(config, callback) {
                return callback(null, config);
            }
        }

        const bar = new Foo({ foo: 'bar' });

        assert.instanceOf(bar, Executor);
        bar.stream({
            buildId: 'a'
        }, (err, data) => {
            assert.isNull(err);
            assert.equal(data.buildId, 'a');
            done();
        });
    });
});

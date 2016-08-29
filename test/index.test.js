'use strict';
const assert = require('chai').assert;
const mockery = require('mockery');
const Joi = require('joi');

describe('index test', () => {
    let instance;
    let schemaMock;
    let Executor;

    before(() => {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });
    });

    beforeEach(() => {
        schemaMock = {
            plugins: {
                executor: {
                    start: Joi.object().required(),
                    stop: Joi.object().required()
                }
            }
        };
        mockery.registerMock('screwdriver-data-schema', schemaMock);

        // eslint-disable-next-line global-require
        Executor = require('../index');

        instance = new Executor({ foo: 'bar' });
    });

    afterEach(() => {
        instance = null;
        mockery.deregisterAll();
        mockery.resetCache();
    });

    after(() => {
        mockery.disable();
    });

    it('can create a Executor base class', () => {
        assert.instanceOf(instance, Executor);
    });

    it('contains a stats method', () => {
        assert.deepEqual(instance.stats(), {});
    });

    it('start returns an error when not overridden', (done) => {
        instance.start({}, (err) => {
            assert.isOk(err, 'error is null');
            done();
        });
    });

    it('start returns an error when fails validation', (done) => {
        instance.start('blah', (err) => {
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

    it('stop returns an error when fails validation', (done) => {
        instance.stop('blah', (err) => {
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

    it('can be extended', (done) => {
        class Foo extends Executor {
            _stop(config, callback) {
                return callback(null, config);
            }
        }

        const bar = new Foo({ foo: 'bar' });

        assert.instanceOf(bar, Executor);
        bar.stop({
            buildId: 'a'
        }, (err, data) => {
            assert.isNull(err);
            assert.equal(data.buildId, 'a');
            done();
        });
    });
});

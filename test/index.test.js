'use strict';

const { assert } = require('chai');
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
                    stop: Joi.object().required(),
                    startPeriodic: Joi.object().required(),
                    stopPeriodic: Joi.object().required(),
                    startFrozen: Joi.object().required(),
                    stopFrozen: Joi.object().required(),
                    status: Joi.object().required()
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

    it('start returns an error when not overridden', () => (
        instance.start({})
            .then(() => {
                throw new Error('Oh no');
            }, (err) => {
                assert.isOk(err, 'err is null');
                assert.equal(err.message, 'Not implemented');
            })
    ));

    it('start returns an error when fails validation', () => (
        instance.start('blah')
            .then(() => {
                throw new Error('Oh no');
            }, (err) => {
                assert.isOk(err, 'error is null');
                assert.equal(err, 'ValidationError: "value" must be an object');
            })
    ));

    it('stop returns an error when not overridden', () => (
        instance.stop({})
            .then(() => {
                throw new Error('Oh no');
            }, (err) => {
                assert.isOk(err, 'error is null');
                assert.equal(err.message, 'Not implemented');
            })
    ));

    it('stop returns an error when fails validation', () => (
        instance.stop('blah')
            .then(() => {
                throw new Error('Oh no');
            }, (err) => {
                assert.isOk(err, 'error is null');
                assert.equal(err, 'ValidationError: "value" must be an object');
            })
    ));

    it('startPeriodic returns an error when not overridden', () => (
        instance.startPeriodic({})
            .then(() => {
                throw new Error('Oh no');
            }, (err) => {
                assert.isOk(err, 'err is null');
                assert.equal(err.message, 'Not implemented');
            })
    ));

    it('stopPeriodic returns an error when not overridden', () => (
        instance.stopPeriodic({})
            .then(() => {
                throw new Error('Oh no');
            }, (err) => {
                assert.isOk(err, 'error is null');
                assert.equal(err.message, 'Not implemented');
            })
    ));

    it('startFrozen returns an error when not overridden', () => (
        instance.startFrozen({})
            .then(() => {
                throw new Error('Oh no');
            }, (err) => {
                assert.isOk(err, 'err is null');
                assert.equal(err.message, 'Not implemented');
            })
    ));

    it('stopFrozen returns an error when not overridden', () => (
        instance.stopFrozen({})
            .then(() => {
                throw new Error('Oh no');
            }, (err) => {
                assert.isOk(err, 'error is null');
                assert.equal(err.message, 'Not implemented');
            })
    ));

    it('status returns an error when not overridden', () => (
        instance.status({})
            .then(() => {
                throw new Error('Oh no');
            }, (err) => {
                assert.isOk(err, 'error is null');
                assert.equal(err.message, 'Not implemented');
            })
    ));

    it('status returns an error when fails validation', () => (
        instance.status('blah')
            .then(() => {
                throw new Error('Oh no');
            }, (err) => {
                assert.isOk(err, 'error is null');
                assert.equal(err, 'ValidationError: "value" must be an object');
            })
    ));

    it('parseAnnotations returns a parsed object', () => {
        const parsed = instance.parseAnnotations({
            'beta.screwdriver.cd/cpu': 'HIGH',
            'beta.screwdriver.cd/ram': 'LOW',
            'screwdriver.cd/disk': 'HIGH',
            'screwdriver.cd/nodeLabel': 'foo-label',
            'invald.screwdriver.cd': 'invalid'
        });

        assert.deepEqual(parsed, {
            cpu: 'HIGH',
            ram: 'LOW',
            disk: 'HIGH',
            nodeLabel: 'foo-label'
        });
    });

    it('can be extended', () => {
        class Foo extends Executor {
            _stop(config) {
                return Promise.resolve(config);
            }
        }

        const bar = new Foo({ foo: 'bar' });

        assert.instanceOf(bar, Executor);

        return bar.stop({
            buildId: 'a'
        }).then((data) => {
            assert.equal(data.buildId, 'a');
        });
    });
});

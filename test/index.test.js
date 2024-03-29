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
                    status: Joi.object().required(),
                    verify: Joi.object().required()
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

    it('start returns an error when not overridden', () =>
        instance.start({}).then(
            () => {
                throw new Error('Oh no');
            },
            err => {
                assert.isOk(err, 'err is null');
                assert.equal(err.message, 'Not implemented');
            }
        ));

    it('start returns an error when fails validation', () =>
        instance.start('blah').then(
            () => {
                throw new Error('Oh no');
            },
            err => {
                assert.isOk(err, 'error is null');
                assert.equal(err, 'ValidationError: "value" must be of type object');
            }
        ));

    it('verify does not return an error when not overridden', () =>
        instance.verify({}).then(
            message => {
                assert.equal(message, undefined);
            },
            () => {
                throw new Error('should not fail');
            }
        ));

    it('verify returns an error when fails validation', () =>
        instance.verify('blah').then(
            () => {
                throw new Error('Oh no');
            },
            err => {
                assert.isOk(err, 'error is null');
                assert.equal(err, 'ValidationError: "value" must be of type object');
            }
        ));

    it('stop returns an error when not overridden', () =>
        instance.stop({}).then(
            () => {
                throw new Error('Oh no');
            },
            err => {
                assert.isOk(err, 'error is null');
                assert.equal(err.message, 'Not implemented');
            }
        ));

    it('stop returns an error when fails validation', () =>
        instance.stop('blah').then(
            () => {
                throw new Error('Oh no');
            },
            err => {
                assert.isOk(err, 'error is null');
                assert.equal(err, 'ValidationError: "value" must be of type object');
            }
        ));

    it('startPeriodic returns an error when not overridden', () =>
        instance.startPeriodic({}).then(
            () => {
                throw new Error('Oh no');
            },
            err => {
                assert.isOk(err, 'err is null');
                assert.equal(err.message, 'Not implemented');
            }
        ));

    it('stopPeriodic returns an error when not overridden', () =>
        instance.stopPeriodic({}).then(
            () => {
                throw new Error('Oh no');
            },
            err => {
                assert.isOk(err, 'error is null');
                assert.equal(err.message, 'Not implemented');
            }
        ));

    it('startFrozen returns an error when not overridden', () =>
        instance.startFrozen({}).then(
            () => {
                throw new Error('Oh no');
            },
            err => {
                assert.isOk(err, 'err is null');
                assert.equal(err.message, 'Not implemented');
            }
        ));

    it('stopFrozen returns an error when not overridden', () =>
        instance.stopFrozen({}).then(
            () => {
                throw new Error('Oh no');
            },
            err => {
                assert.isOk(err, 'error is null');
                assert.equal(err.message, 'Not implemented');
            }
        ));

    it('status returns an error when not overridden', () =>
        instance.status({}).then(
            () => {
                throw new Error('Oh no');
            },
            err => {
                assert.isOk(err, 'error is null');
                assert.equal(err.message, 'Not implemented');
            }
        ));

    it('status returns an error when fails validation', () =>
        instance.status('blah').then(
            () => {
                throw new Error('Oh no');
            },
            err => {
                assert.isOk(err, 'error is null');
                assert.equal(err, 'ValidationError: "value" must be of type object');
            }
        ));

    it('startTimer does not returns error when not overridden', () =>
        instance.startTimer().then(
            () => Promise.resolve(),
            err => {
                assert.isOk(err, 'error is null');
            }
        ));

    it('stopTimer does not returns error when not overridden', () =>
        instance.stopTimer().then(
            () => Promise.resolve(),
            err => {
                assert.isOk(err, 'error is null');
            }
        ));

    it('cleanUp does not returns error when not overridden', () =>
        instance.cleanUp().then(
            () => Promise.resolve(),
            err => {
                assert.isOk(err, 'error is null');
            }
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

    it('unzipArtifacts returns an error when not overridden', () =>
        instance.unzipArtifacts({}).then(
            () => {
                throw new Error('Oh no');
            },
            err => {
                assert.isOk(err, 'error is null');
                assert.equal(err.message, 'Not implemented');
            }
        ));

    it('enqueueWebhook returns an error when not overridden', () =>
        instance.enqueueWebhook({}).then(
            () => {
                throw new Error('Oh no');
            },
            err => {
                assert.isOk(err, 'error is null');
                assert.equal(err.message, 'Not implemented');
            }
        ));

    it('can be extended', () => {
        class Foo extends Executor {
            _stop(config) {
                return Promise.resolve(config);
            }
        }

        const bar = new Foo({ foo: 'bar' });

        assert.instanceOf(bar, Executor);

        return bar
            .stop({
                buildId: 'a'
            })
            .then(data => {
                assert.equal(data.buildId, 'a');
            });
    });
});

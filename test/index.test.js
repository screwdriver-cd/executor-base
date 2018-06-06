'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const mockery = require('mockery');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const DEFAULT_BUILD_TIMEOUT = 90; // in minutes

describe('index test', () => {
    let instance;
    let schemaMock;
    let Executor;
    let requestMock;

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
                    status: Joi.object().required(),
                    exchangeTokenForBuild: Joi.object().required()
                }
            }
        };
        requestMock = sinon.stub();
        mockery.registerMock('requestretry', requestMock);

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

    describe('exchangeTokenForBuild', () => {
        let postConfig;
        let options;
        let buildTimeout;
        let fakeResponse;
        let token;

        beforeEach(() => {
            token = jwt.sign({ scope: ['temporal'] }, 'dummyPrivateKey');
            postConfig = {
                buildId: 111,
                apiUri: 'https://dummy.com',
                token
            };
            buildTimeout = 150;
            options = {
                uri: `${postConfig.apiUri}/v4/builds/${postConfig.buildId}/token`,
                method: 'POST',
                body: { buildTimeout },
                headers: { Authorization: `Bearer ${postConfig.token}` },
                strictSSL: true,
                json: true
            };
            fakeResponse = {
                statusCode: 200,
                body: {
                    token: 'dummyBuildToken'
                }
            };
        });

        it('succeeds to exchange temporal JWT to build JWT', async () => {
            requestMock.withArgs(options).resolves(fakeResponse);

            await instance.exchangeTokenForBuild(postConfig, buildTimeout).then((buildToken) => {
                assert.equal(fakeResponse.body.token, buildToken);
            });
        });

        it('succeeds to exchange temporal JWT to build JWT without buildTimeout args', async () => {
            options.body.buildTimeout = DEFAULT_BUILD_TIMEOUT;
            requestMock.withArgs(options).resolves(fakeResponse);

            await instance.exchangeTokenForBuild(postConfig).then((buildToken) => {
                assert.equal(fakeResponse.body.token, buildToken);
            });
        });

        it('does not exchange and return token as it is if it is already build JWT', async () => {
            token = jwt.sign({ scope: ['build'] }, 'dummyPrivateKey');
            postConfig.token = token;

            await instance.exchangeTokenForBuild(postConfig).then((buildToken) => {
                assert.equal(postConfig.token, buildToken);
            });
        });

        it('returns error if buildTimeout value is invalid', async () => {
            buildTimeout = 'aaa';
            const returnMessage = `Invalid buildTimeout value: ${buildTimeout}`;

            await instance.exchangeTokenForBuild(postConfig, buildTimeout).then(() => {
                throw new Error('did not fail');
            }, (err) => {
                assert.equal(err.message, returnMessage);
            });
        });

        it('returns error if response code is not 200', async () => {
            fakeResponse.statusCode = 409;

            const returnMessage =
            `Failed to exchange build token: ${JSON.stringify(fakeResponse.body)}`;

            requestMock.withArgs(options).resolves(fakeResponse);

            await instance.exchangeTokenForBuild(postConfig, buildTimeout).then(() => {
                throw new Error('did not fail');
            }, (err) => {
                assert.equal(err.message, returnMessage);
            });
        });
    });
});

'use strict';

/* eslint-disable no-underscore-dangle */
const Joi = require('joi');
const dataSchema = require('screwdriver-data-schema');
const executorSchema = dataSchema.plugins.executor;
const request = require('requestretry');
const DEFAULT_BUILD_TIMEOUT = 90; // in minutes

/**
 * Validate the config using the schema
 * @async  validate
 * @param  {Object}    config       Configuration
 * @param  {Object}    schema       Joi object used for validation
 * @return {Promise}
 */
async function validate(config, schema) {
    const result = Joi.validate(config, schema);

    if (result.error) {
        throw result.error;
    }

    return config;
}

class Executor {
    /**
     * Constructor for Executor
     * @method constructor
     * @param  {Object}    config Configuration
     * @return {Executor}
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Start a new build
     * @method start
     * @param  {Object} config               Configuration
     * @param  {Object} [config.annotations] Optional key/value object
     * @param  {String} config.apiUri        Screwdriver's API
     * @param  {String} config.buildId       Unique ID for a build
     * @param  {String} config.container     Container for the build to run in
     * @param  {String} config.token         JWT to act on behalf of the build
     * @return {Promise}
     */
    start(config) {
        return validate(config, executorSchema.start)
            .then(validConfig => this._start(validConfig));
    }

    async _start() {
        throw new Error('Not implemented');
    }

    /**
     * Stop a running or finished build
     * @method stop
     * @param  {Object} config               Configuration
     * @param  {String} config.buildId       Unique ID for a build
     * @return {Promise}
     */
    stop(config) {
        return validate(config, executorSchema.stop)
            .then(validConfig => this._stop(validConfig));
    }

    async _stop() {
        throw new Error('Not implemented');
    }

    /**
      * Starts a new periodic build in an executor
      * @method _startPeriodic
      * @param {Object} config               Configuration
      * @return {Promise}
      */
    startPeriodic(config) {
        return this._startPeriodic(config);
    }

    async _startPeriodic() {
        throw new Error('Not implemented');
    }

    /**
     * Stops a previously scheduled periodic build in an executor
     * @async  _stopPeriodic
     * @param  {Object}  config        Configuration
     * @return {Promise}
     */
    stopPeriodic(config) {
        return this._stopPeriodic(config);
    }

    async _stopPeriodic() {
        throw new Error('Not implemented');
    }

    /**
     * Get the status of a build
     * @method status
     * @param  {Object} config               Configuration
     * @param  {String} config.buildId       Unique ID for a build
     * @return {Promise}
     */
    status(config) {
        return validate(config, executorSchema.status)
            .then(validConfig => this._status(validConfig));
    }

    async _status() {
        throw new Error('Not implemented');
    }

    /**
     * Return statistics on the executor
     * @method stats
     * @return {Object} object           Hash containing metrics for the executor
     */
    stats() {
        return {};
    }

    /**
     * Get JWT for build by using temporal JWT via API
     * @method exchangeTokenForBuild
     * @param  {Object}  config          A configuration object
     * @param  {String}  config.apiUrl   Base URL for Screwdriver API
     * @param  {String}  config.buildId  Build ID
     * @param  {String}  config.token    Temporal JWT
     * @param  {String}  buildTimeout    Build timeout value which will be JWT expires time
     * @return {Promise}
     */
    async exchangeTokenForBuild(config, buildTimeout = DEFAULT_BUILD_TIMEOUT) {
        if (isFinite(buildTimeout) === false) {
            throw new Error(`Invalid buildTimeout value: ${buildTimeout}`);
        }

        const options = {
            uri: `${config.apiUri}/v4/builds/${config.buildId}/token`,
            method: 'POST',
            body: { buildTimeout },
            headers: { Authorization: `Bearer ${config.token}` },
            strictSSL: true,
            json: true
        };

        const response = await request(options);

        if (response.statusCode !== 200) {
            throw new Error(`Failed to exchange build token: ${JSON.stringify(response.body)}`);
        }

        return response.body.token;
    }
}

module.exports = Executor;

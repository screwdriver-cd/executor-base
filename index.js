'use strict';
/* eslint-disable no-underscore-dangle */
const Joi = require('joi');
const dataSchema = require('screwdriver-data-schema');
const executorSchema = dataSchema.plugins.executor;

/**
 * Validate the config using the schema
 * @method  validate
 * @param  {Object}    config       Configuration
 * @param  {Object}    schema       Joi object used for validation
 * @return {Promise}
 */
function validate(config, schema) {
    const result = Joi.validate(config, schema);

    if (result.error) {
        return Promise.reject(result.error);
    }

    return Promise.resolve(config);
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
     * @param {Object} config               Configuration
     * @param {String} config.buildId       Unique ID for a build
     * @param {String} config.container     Container for the build to run in
     * @param {String} config.apiUri        Screwdriver's API
     * @param {String} config.token         JWT to act on behalf of the build
     * @return {Promise}
     */
    start(config) {
        return validate(config, executorSchema.start)
            .then(validConfig => this._start(validConfig));
    }

    _start() {
        return Promise.reject('Not implemented');
    }

    /**
     * Stop a running or finished build
     * @method stop
     * @param {Object} config               Configuration
     * @param {String} config.buildId       Unique ID for a build
     * @return {Promise}
     */
    stop(config) {
        return validate(config, executorSchema.stop)
            .then(validConfig => this._stop(validConfig));
    }

    _stop() {
        return Promise.reject('Not implemented');
    }

    /**
     * Get the status of a build
     * @method status
     * @param {Object} config               Configuration
     * @param {String} config.buildId       Unique ID for a build
     * @return {Promise}
     */
    status(config) {
        return validate(config, executorSchema.status)
            .then(validConfig => this._status(validConfig));
    }

    _status() {
        return Promise.reject('Not implemented');
    }

    /**
     * Return statistics on the executor
     * @method stats
     * @return {Object} object           Hash containing metrics for the executor
     */
    stats() {
        return {};
    }
}

module.exports = Executor;

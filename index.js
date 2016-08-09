'use strict';
/* eslint-disable no-underscore-dangle */
const Joi = require('joi');
const schema = require('screwdriver-data-schema');
const executorSchema = schema.plugins.executor;

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
     * Validate the config for _start method
     * @method start
     * @param {Object} config               Configuration
     * @param {String} config.buildId       Unique ID for a build
     * @param {String} config.container     Container for the build to run in
     * @param {String} config.apiUri        Screwdriver's API
     * @param {String} config.token         JWT to act on behalf of the build
     * @param {Function} callback           Function to call when done
     */
    start(config, callback) {
        const result = Joi.validate(config, executorSchema.start);

        if (result.error) {
            return callback(result.error);
        }

        return this._start(config, callback);
    }

    _start(config, callback) {
        callback(new Error('not implemented'));
    }

    /**
     * Validate the config for _stop method
     * @method stop
     * @param {Object} config               Configuration
     * @param {String} config.buildId       Build id
     * @param {Function} callback           Function to call when done
     */
    stop(config, callback) {
        const result = Joi.validate(config, executorSchema.stop);

        if (result.error) {
            return callback(result.error);
        }

        return this._stop(config, callback);
    }

    _stop(config, callback) {
        callback(new Error('not implemented'));
    }

    /**
     * Validate config for _stream method
     * @method stream
     * @param {Object} config               Configuration
     * @param {String} config.buildId       Build id
     * @param {Function} callback           Function to call when done
     */
    stream(config, callback) {
        const result = Joi.validate(config, executorSchema.stream);

        if (result.error) {
            return callback(result.error);
        }

        return this._stream(config, callback);
    }

    _stream(config, callback) {
        callback(new Error('not implemented'));
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

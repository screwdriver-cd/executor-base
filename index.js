'use strict';

/* eslint-disable no-underscore-dangle */
const Joi = require('joi');
const dataSchema = require('screwdriver-data-schema');
const executorSchema = dataSchema.plugins.executor;
const ANNOTATIONS = [
    'screwdriver.cd/cpu',
    'screwdriver.cd/ram',
    'screwdriver.cd/disk',
    'screwdriver.cd/diskSpeed',
    'screwdriver.cd/timeout',
    'screwdriver.cd/executor',
    'screwdriver.cd/buildPeriodically',
    'screwdriver.cd/repoManifest',
    'screwdriver.cd/dockerEnabled',
    'screwdriver.cd/dockerCpu',
    'screwdriver.cd/dockerRam',
    'screwdriver.cd/nodeLabel'
];
const annotationRe = /screwdriver.cd\/(\w+)/;

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
     * @param  {Object} [config.build]       Build object
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
      * Starts a new frozen build in an executor
      * @method _startFrozen
      * @param {Object} config               Configuration
      * @return {Promise}
      */
    startFrozen(config) {
        return this._startFrozen(config);
    }

    async _startFrozen() {
        throw new Error('Not implemented');
    }

    /**
     * Stops a previously scheduled frozen build in an executor
     * @async  _stopFrozen
     * @param  {Object}  config        Configuration
     * @return {Promise}
     */
    stopFrozen(config) {
        return this._stopFrozen(config);
    }

    async _stopFrozen() {
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
     * Parsed annotations object
     * @method parseAnnotations
     * @return {Object} object           Object contains parsed annotations
     */
    parseAnnotations(annotations) {
        const parsedAnnotations = {};

        Object.keys(annotations).forEach((key) => {
            const parsedKey = key.replace(/^beta./, '');

            if (ANNOTATIONS.includes(parsedKey)) {
                // First group will be the part after slash, e.g. cpu, ram, disk
                parsedAnnotations[parsedKey.match(annotationRe)[1]] = annotations[key];
            }
        });

        return parsedAnnotations;
    }
}

module.exports = Executor;

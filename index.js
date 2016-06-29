'use strict';
/* eslint-disable no-console */

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
     * Start the executor
     * @method start
     * @param {Object} config               Configuration
     * @param {String} config.buildId       Build id
     * @param {String} config.jobId         Job id
     * @param {String} config.pipelineId    Pipeline id
     * @param {String} config.container     Container
     * @param {String} config.scmUrl        Scm url
     * @param {Function} callback
     */
    start() {
        console.error('start is not implemented');
        throw new Error('not implemented');
    }

    /**
     * Stop the executor
     * @method stop
     * @param {Object} config               Configuration
     * @param {String} config.buildId       Build id
     * @param {String} config.jobId         Job id
     * @param {String} config.pipelineId    Pipeline id
     * @param {String} config.container     Container
     * @param {String} config.scmUrl        Scm url
     * @param {Function} callback
     */
    stop() {
        console.error('stop is not implemented');
        throw new Error('not implemented');
    }
}

module.exports = Executor;

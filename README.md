# executor base
[![Version][npm-image]][npm-url] ![Downloads][downloads-image] [![Build Status][wercker-image]][wercker-url] [![Open Issues][issues-image]][issues-url] [![Dependency Status][daviddm-image]][daviddm-url] ![License][license-image]

> Base class defining the interface for executor implementations

## Usage

```bash
npm install screwdriver-executor-base
```

## Extending
```js
class MyExecutor extends Executor {
    // Implement the interface
    start(config, callback) {
        if (config.buildId) {
            // do stuff here...
            return callback(null);
        }

        return process.nextTick(() => {
            callback(new Error('Error starting executor'));
        });
    }
}

const executor = new MyExecutor({});
executor.start({
    buildId: '4b8d9b530d2e5e297b4f470d5b0a6e1310d29c5e',
    jobId: '50dc14f719cdc2c9cb1fb0e49dd2acc4cf6189a0',
    pipelineId: 'ccc49349d3cffbd12ea9e3d41521480b4aa5de5f',
    container: 'node:4',
    scmUrl: 'git@github.com:screwdriver-cd/data-model.git#master'
}, (err) => {
    // do something...
});
```
## Testing

```bash
npm test
```

## License

Code licensed under the BSD 3-Clause license. See LICENSE file for terms.

[npm-image]: https://img.shields.io/npm/v/screwdriver-executor-base.svg
[npm-url]: https://npmjs.org/package/screwdriver-executor-base
[downloads-image]: https://img.shields.io/npm/dt/screwdriver-executor-base.svg
[license-image]: https://img.shields.io/npm/l/screwdriver-executor-base.svg
[issues-image]: https://img.shields.io/github/issues/screwdriver-cd/executor-base.svg
[issues-url]: https://github.com/screwdriver-cd/executor-base/issues
[wercker-image]: https://app.wercker.com/status/a520b28caca342b4419caa09a8875607
[wercker-url]: https://app.wercker.com/project/bykey/a520b28caca342b4419caa09a8875607
[daviddm-image]: https://david-dm.org/screwdriver-cd/executor-base.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/screwdriver-cd/executor-base

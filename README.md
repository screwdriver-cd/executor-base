# Executor Base
[![Version][npm-image]][npm-url] ![Downloads][downloads-image] [![Build Status][wercker-image]][wercker-url] [![Open Issues][issues-image]][issues-url] [![Dependency Status][daviddm-image]][daviddm-url] ![License][license-image]

> Base class defining the interface for executor implementations

An executor is an engine that is capable of running a set of docker containers together.

i.e. Jenkins, Kubernetes, ECS, Mesos

The intention of an executor is to run the `launch` script defined in the [screwdriver job-tools] docker container, which is mounted to a container defined by a screwdriver [task]

This means:

1. Mounting the job-tools container as a volume to $MOUNT_POINT on another container
2. Running the `launch` script as the entry point to the task container
```
SD_TOKEN=${token} $MOUNT_POINT/launch --api-uri ${api_uri} ${build_id}
```

## Usage

```bash
npm install screwdriver-executor-base
```

### Interface
#### Start
##### Required Parameters
| Parameter        | Type  |  Description |
| :-------------   | :---- | :-------------|
| config        | Object | Configuration Object |
| config.buildId | String | The unique ID for a build |
| config.container | String | Container for the build to run in |
| config.apiUri | String | Screwdriver's API |
| config.token | String | JWT to act on behalf of the build |
| callback | Function | Callback for when task has been created |

##### Expected Outcome
The start function is expected to create a [task] in the execution engine.

##### Expected Callback
1. When an error occurs, `callback(err)`
2. When the task is created correctly, `callback(null)`

#### Stream
##### Required Parameters
| Parameter        |  Type  | Description |
| :-------------   | :----- | :-------------|
| config           | Object | Configuration Object |
| config.buildId   | String | The unique ID for a build |
| callback         | Function | Callback for when stream has been created |

##### Expected Outcome
The stream function is expected to return a readable stream upon success

##### Expected Callback
1. When an error occurs, `callback(err)`
2. When the stream is created correctly, `callback(null, stream)`

## Extending
To make use of the validation function for start, stop and stream, you need to
override the `_start`, `_stop`, `_stream` methods.

```js
class MyExecutor extends Executor {
    // Implement the interface
    _start(config, callback) {
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
    container: 'node:4',
    apiUri: 'http://localhost:8080',
    token: 'abcdefg'
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
[task]: https://github.com/screwdriver-cd/data-schema/blob/master/model/task.js
[screwdriver job-tools]: https://github.com/screwdriver-cd/job-tools

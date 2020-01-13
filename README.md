# Executor Base
[![Version][npm-image]][npm-url] ![Downloads][downloads-image] [![Build Status][status-image]][status-url] [![Open Issues][issues-image]][issues-url] [![Dependency Status][daviddm-image]][daviddm-url] ![License][license-image]

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
| config.annotations | Object | Optional key/value object |
| config.apiUri | String | Screwdriver's API |
| config.buildId | String | The unique ID for a build |
| config.container | String | Container for the build to run in |
| config.token | String | Temporary JWT which Executor must exchange with API to get JWT which can act on behalf of the build |

##### Expected Outcome
The start function is expected to create a [task] in the execution engine.

##### Expected Return
A Promise that resolves if the task is created correctly, or rejects if it fails.

#### Stop
##### Required Parameters
| Parameter        | Type  |  Description |
| :-------------   | :---- | :-------------|
| config        | Object | Configuration Object |
| config.buildId | String | The unique ID for a build |

##### Expected Outcome
The stop function is expected to stop/cleanup a [task] in the execution engine.

##### Expected Return
A Promise that resolves if the task is cleaned up correctly, or rejects if it fails.

#### Status
##### Required Parameters
| Parameter        | Type  |  Description |
| :-------------   | :---- | :-------------|
| config        | Object | Configuration Object |
| config.buildId | String | The unique ID for a build |

##### Expected Outcome
The status function is expected to get a human readable status of a [task] in the execution engine.

##### Expected Return
A Promise that resolves with the current build status, or rejects if it fails.

#### Stats
##### Expected Outcome
The `stats` function is expected to return an object of statistics

#### Status
##### Required Parameters
| Parameter        | Type  |  Description |
| :-------------   | :---- | :-------------|
| config        | Object | Configuration Object |
| config.token | String | Temporary JWT for a build |
| buildTimeout | Number | Build timeout in minutes |

##### Expected Outcome
The `exchangeTokenForBuild` function will call API to exchange temporary build JWT with actual build JWT.

##### Expected Return
A Promise which resolves to actual build JWT


#### CleanUp
##### Expected Outcome
The cleanUp function is expected to handle any housekeeping operations like closing connections, queues during the SIGTERM event.
Default is no-op

##### Expected Return
A Promise that resolves or rejects.

#### StartTimer
##### Required Parameters
| Parameter        | Type  |  Description |
| :-------------   | :---- | :-------------|
| config        | Object | Configuration Object |
| config.annotations | Object | Optional key/value object |
| config.buildStatus | String | The status of the  build |
| config.buildId | String | The unique ID for a build |
| config.startTime | String | ISO start time of the build |
| config.jobId | String | job id of the build |
##### Expected Outcome
The StartTimer function is expected to add buildId as key and timeout config value to timeout queue
Default is no-op

##### Expected Return
A Promise that resolves or rejects.

#### StopTimer
##### Required Parameters
| Parameter        | Type  |  Description |
| :-------------   | :---- | :-------------|
| config        | Object | Configuration Object |
| config.buildId | String | The unique ID for a build |
##### Expected Outcome
The StopTimer function is expected to remove key/value buildId from timeout queue
Default is no-op

##### Expected Return
A Promise that resolves or rejects.


## Extending
To make use of the validation function for start and stop, you need to
override the `_start` , `_stop` and `_cleanUp` methods.

```js
class MyExecutor extends Executor {
    // Implement the interface
    _start(config) {
        if (config.buildId) {
            return this.exchangeTokenForBuild(config.token, buildTimeout).then(buildToken => {
                // do stuff here...
                return Promise.resolve(null);
            });
        }

        return Promise.reject(new Error('Error starting executor'));
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
[issues-image]: https://img.shields.io/github/issues/screwdriver-cd/screwdriver.svg
[issues-url]: https://github.com/screwdriver-cd/screwdriver/issues
[status-image]: https://cd.screwdriver.cd/pipelines/25/badge
[status-url]: https://cd.screwdriver.cd/pipelines/25
[daviddm-image]: https://david-dm.org/screwdriver-cd/executor-base.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/screwdriver-cd/executor-base
[task]: https://github.com/screwdriver-cd/data-schema/blob/master/model/task.js
[screwdriver job-tools]: https://github.com/screwdriver-cd/job-tools

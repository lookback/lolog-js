lolog-js
========

This is a logging package that follows our [logging architecture](https://www.notion.so/lookback/Logging-3574fa498c9742d681a8120a7c1bb480)

## Usage

```javascript
const log = lolog.createLogger({
    logHost: 'syslogger.lookback.io',
    logPort: 12345,
    host: 'browser',
    appName: 'site-liveplayer',
    apiKey: '<redacted>',
    env: 'testing',
    compliance: lolog.Compliance.Full,
});

// simple message
log.info('hello world');

// well known fields such as recording id
log.info('hello world', {recordingId: 'r123457'});

// arbitrary structured data.
log.info('hello world', {}, {random: 42});

// well known fields and arbitrary structured data.
log.info('hello world', {recordingId: 'r123457'}, {random: 42});
```

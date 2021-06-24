const SEVERITIES = ['log', 'error', 'warn', 'info'];

class Logger {
  constructor() {
    this.log = (...args) => this.execute('log', ...args);
    this.error = (...args) => this.execute('error', ...args);
    this.warn = (...args) => this.execute('warn', ...args);
    this.info = (...args) => this.execute('info', ...args);
  }

  execute(severity, ...args) {
    if (
      process.env.NODE_ENV !== 'production' &&
      SEVERITIES.includes(severity)
    ) {
      // eslint-disable-next-line no-console
      console[severity](...args);
    }
  }
}

const logger = new Logger();

module.exports = logger;

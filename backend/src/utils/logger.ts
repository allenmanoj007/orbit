type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const isDevelopment = process.env.NODE_ENV !== 'production';

const colors = {
  info: '\x1b[36m',   // cyan
  warn: '\x1b[33m',   // yellow
  error: '\x1b[31m',  // red
  debug: '\x1b[35m',  // magenta
  reset: '\x1b[0m',
};

function formatTimestamp(): string {
  return new Date().toISOString();
}

function log(level: LogLevel, message: string, ...args: unknown[]): void {
  if (level === 'debug' && !isDevelopment) return;

  const timestamp = formatTimestamp();
  const color = colors[level];
  const reset = colors.reset;
  const levelUpper = level.toUpperCase().padEnd(5);

  const prefix = isDevelopment
    ? `${color}[${timestamp}] [${levelUpper}]${reset}`
    : `[${timestamp}] [${levelUpper}]`;

  if (args.length > 0) {
    const formattedArgs = args.map(arg =>
      arg instanceof Error ? arg.stack ?? arg.message :
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
      `${prefix} ${message}`,
      formattedArgs
    );
  } else {
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
      `${prefix} ${message}`
    );
  }
}

export const logger = {
  info: (message: string, ...args: unknown[]) => log('info', message, ...args),
  warn: (message: string, ...args: unknown[]) => log('warn', message, ...args),
  error: (message: string, ...args: unknown[]) => log('error', message, ...args),
  debug: (message: string, ...args: unknown[]) => log('debug', message, ...args),
};

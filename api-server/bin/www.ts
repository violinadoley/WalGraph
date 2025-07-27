#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../src/app';
import debugLib from 'debug';
import http from 'http';
import env from '../src/config/environment';

const debug = debugLib('walgraph-enterprise-api:server');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(env.PORT);
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string | number): number | string | false {
  const port = parseInt(val.toString(), 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : addr && addr.port;
  debug('Listening on ' + bind);
  console.log(`🚀 WalGraph Enterprise API running on port ${port}`);
  console.log(`📖 API Documentation: http://localhost:${port}/docs`);
  console.log(`🏥 Health Check: http://localhost:${port}/health`);
}

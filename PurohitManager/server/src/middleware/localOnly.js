/**
 * Local-only middleware: Rejects any external or non-localhost requests for offline security
 */
export function localOnly(req, res, next) {
  const remoteIp = req.socket.remoteAddress || req.connection.remoteAddress;

  // Accept localhost IPv4, IPv6, and mapped IPv4
  const isLocal = remoteIp === '127.0.0.1' ||
                  remoteIp === '::1' ||
                  remoteIp === '::ffff:127.0.0.1';

  if (!isLocal) {
    return res.status(403).json({
      error: "Forbidden: PurohitManager runs strictly on local machine (127.0.0.1)."
    });
  }
  next();
}


export function info(message) {
  console.log(`[INFO] ${getTimestamp()} - ${message}`);
}

export function error(message) {
  console.error(`[ERROR] ${getTimestamp()} - ${message}`);
}

function getTimestamp() {
  return new Date().toISOString();
}

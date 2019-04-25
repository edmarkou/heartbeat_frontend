export function attachHeartbeats(heartbeats) {
  return {
    type: 'GET_HEARTBEATS',
    payload: heartbeats
  }
}

export function attachSelectedHeartbeat(heartbeat) {
  return {
    type: 'GET_HEARTBEAT',
    payload: heartbeat
  }
}
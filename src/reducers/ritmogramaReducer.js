import { GETHEARTBEATS, GETHEARTBEAT } from '../actions/heartbeatActionTypes';

const initialState = {
  heartbeats: [],
  activeHeartbeat: {}
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case GETHEARTBEATS: 
      return { heartbeats: action.payload, activeHeartbeat: state.activeHeartbeat };
    case GETHEARTBEAT: 
      return { heartbeats: state.heartbeats, activeHeartbeat: action.payload };
    default: 
      return state;
  }
}

export default reducer;
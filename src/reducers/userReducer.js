import { LOGIN, LOGOUT } from '../actions/userActionTypes';

const initialState = {
  name: '',
  userType: ''
}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case LOGIN: 
      return action.payload;
    case LOGOUT: 
      return action.payload;
    default: 
      return state;
  }
}
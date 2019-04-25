import { GETUSERS, GETEXPERTS } from '../actions/userActionTypes';

const initialState = {
  users: [],
  experts: []
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case GETUSERS: 
      return { users: action.payload, experts: state.experts }
    case GETEXPERTS: 
      return { users: state.users, experts: action.payload }
    default: 
      return state;
  }
}
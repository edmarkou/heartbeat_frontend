export function login(user) {
  return {
    type: 'LOGIN',
    payload: user
  }
}

export function logout() {
  return {
    type: 'LOGOUT',
    payload: {
      name: '', 
      userType: ''
    }
  }
}

export function attachUsers(users) {
    return {
      type: 'GETUSERS',
      payload: users
    }
}

export function attachExperts(users) {
  return {
    type: 'GETEXPERTS',
    payload: users
  }
}
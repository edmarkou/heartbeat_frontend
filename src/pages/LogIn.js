import React, { Component } from 'react';
import './LogIn.css';
import heart from '../assets/images/heart.png';
import { Redirect } from 'react-router-dom';
import { login } from '../actions/userActions';
import { connect } from 'react-redux';
import $ from 'jquery';

class LogIn extends Component {
  constructor(props){
    super(props);

    this.state = {
      name: '',
      surname: '',
      password: '',
      logIn: false,
    }
  }

  renderRedirect = () => {
    if (this.state.logIn) {
      return <Redirect to='/'/>
    }
  }

  logIn() {
    const { name, surname, password } = this.state;
    if (
      name.length > 0 &&
      surname.length > 0 &&
      password.length > 0
    ) {

      $.ajax({
        'type': 'GET',
        'headers': {'Content-Type': 'application/json'},
        'url': `https://heartbeat-heroku.herokuapp.com/login?name=${name}&lastName=${surname}&password=${password}`, 
        'success': (res, status) => {
          $.ajax({
            'type': 'GET',
            'headers': {'Content-Type': 'application/json'},
            'url': `https://heartbeat-heroku.herokuapp.com/user?userId=${res.userId}`,
            'success': (user, status) => {
              this.props.loginUser(user);
              this.setState({logIn: true});
            },
          })
        },
      })
    }
  }


  render() {
    return (
      <div className="LogIn">
        {this.renderRedirect()}
        <div className="Header">
          <img alt="" src={heart}/>
        </div>
        <div className="logInContainer">
          <div className="inputContainer">
            <div className="title">
              <span className="text">Vardas:</span>
            </div>
            <input 
              value={this.state.name} 
              onChange={event => this.setState({name: event.target.value})}
              className="input"
            />
          </div>
          <div className="inputContainer">
            <div className="title">
              <span className="text">Pavarde:</span>
            </div>
            <input 
              className="input"
              value={this.state.surname} 
              onChange={event => this.setState({surname: event.target.value})}
            />
          </div>
          <div className="inputContainer">
            <div className="title">
              <span className="text">Slaptazodis:</span>
            </div>
            <input 
              className="input"
              type="password"
              value={this.state.password} 
              onChange={event => this.setState({password: event.target.value})}
            />
          </div>
          <div className="buttonContainer">
            <button className="loginButton" onClick={this.logIn.bind(this)}>Prisijungti</button>
          </div>
          <div className="buttonContainer">
            <a href="/recover" className="button">Pamirsau slaptazodi</a>
          </div>
          <div className="buttonContainer">
            <a href="/register" className="button">Registruotis</a>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    user: state.user
  }
};

export default connect(mapStateToProps, { loginUser: login })(LogIn);
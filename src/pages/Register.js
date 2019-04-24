import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Register.css';
import heart from '../assets/images/heart.png';
import $ from 'jquery';
import { login } from '../actions/userActions';
import { connect } from 'react-redux';

class Register extends Component {
  constructor(props){
    super(props);

    this.state = {
      name: '',
      surname: '',
      password: '',
      reEnterPassword: '',
      expert: false,
      licenceNumber: '',
      experience: '',
      workShift: 'ryte',
      accepted: false,
      redirect: false,
      login: false,
    }
  }

  login = () => {
    this.setState({
      redirect: true
    })
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/'/>
    }
  }

  goToLogin = () => {
    this.setState({
      login: true
    })
  }
  renderLoginRedirect = () => {
    if (this.state.login) {
      return <Redirect to='/login'/>
    }
  }

  isValid() {
    const { name, surname, password, reEnterPassword, expert, licenceNumber, experience, accepted } = this.state;
    if (
      name.length > 0 &&
      surname.length > 0 &&
      password.length > 0 &&
      reEnterPassword.length > 0 &&
      password === reEnterPassword &&
      accepted
    ) {
      if (expert) {
        if (licenceNumber.length > 0 && experience.length > 0)
          return true;
        else 
          return false;
      } else 
        return true;
    } 
    else 
      return false;
  }

  createAccount() {
    const { name, surname, password, expert } = this.state;
    if (this.isValid()) {
      const url = 'https://heartbeat-heroku.herokuapp.com/addUser';
      const data = JSON.stringify({
        name,
        lastName: surname,
        password,
        userType: expert ? 'E' : 'U',
        licenceNumber: null,
        experience: null,
      });
      $.ajax({
        'type': 'POST',
        'headers': {'Content-Type': 'application/json'},
        'url': url, 
        'data': data, 
        'success': (res, status) => {
          $.ajax({
            'type': 'GET',
            'headers': {'Content-Type': 'application/json'},
            'url': 'https://heartbeat-heroku.herokuapp.com/user', 
            'data': res, 
            'success': (user, status) => {
              this.props.loginUser(user);
              this.login();
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
        {this.renderLoginRedirect()}
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
          <div className="inputContainer">
            <div className="title">
              <span className="text">Pakartoti slaptazodi:</span>
            </div>
            <input 
              className="input"
              type="password"
              value={this.state.reEnterPassword} 
              onChange={event => this.setState({reEnterPassword: event.target.value})}
            />
          </div>
          <div className="checkboxContainer">
            <input 
              className="checkbox"
              style={{width: 16, height: 16}}
              type="checkbox" 
              checked={this.state.expert}
              onChange={event => this.setState({expert: !this.state.expert})}
            />
            <span className="expert" style={{fontSize: 16}}>Ekspertas</span>
          </div>
          <div className="inputContainer">
            <div className="title">
              <span className="text">Licencijos numeris:</span>
            </div>
            <input 
              className="input"
              type="number"
              value={this.state.licenceNumber} 
              onChange={event => this.setState({licenceNumber: event.target.value})}
            />
          </div>
          <div className="inputContainer">
            <div className="title">
              <span className="text">Darbo patirtis (metais):</span>
            </div>
            <input 
              className="input"
              type="number"
              value={this.state.experience} 
              onChange={event => this.setState({experience: event.target.value})}
            />
          </div>
          <div className="radioContainer">
            <div className="title">
              <span className="text">Darbo laikas:</span>
            </div>
            <div className="radioForm">
              <div className="radio">
                <input
                  type="radio"
                  checked={this.state.workShift === 'ryte'} 
                  onChange={() => this.setState({workShift: 'ryte'})}
                />
                <span className="radioText">Nuo 8:00 iki 15:00</span>
              </div>
              <div className="radio">
                <input
                  type="radio"
                  checked={this.state.workShift === 'vakare'} 
                  onChange={() => this.setState({workShift: 'vakare'})}
                />
                <span className="radioText">Nuo 15:00 iki 22:00</span>
              </div>
            </div>
          </div>
          <div className="checkboxContainer">
            <input 
              className="checkbox"
              type="checkbox" 
              checked={this.state.accepted}
              onChange={() => this.setState({accepted: !this.state.accepted})}
            />
            <span className="expert">Sutinku su GDPR ir Vidines sistemos taisyklemis</span>
          </div>
          <div className="buttonContainer">
            <button 
              className="loginButton"
              onClick={this.createAccount.bind(this)}
            >
              Registruotis
            </button>
            <button 
              className="loginButton" 
              style={{marginLeft: 10}}
              onClick={this.goToLogin.bind(this)}
            >
              Prisijungti
            </button>
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

export default connect(mapStateToProps, { loginUser: login })(Register);
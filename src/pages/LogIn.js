import React, { Component } from 'react';
import './LogIn.css';
import heart from '../assets/images/heart.png';

export default class LogIn extends Component {
  constructor(props){
    super(props);

    this.state = {
      name: '',
      surname: '',
      password: ''
    }
  }


  render() {
    return (
      <div className="LogIn">
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
            <button className="loginButton">Prisijungti</button>
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
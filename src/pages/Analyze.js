import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Analyze.css';
import heart from '../assets/images/heart.png';
import message from '../assets/images/message.png';
import { connect } from 'react-redux';
import { logout } from '../actions/userActions';
import $ from 'jquery';

class Analysis extends Component {
  constructor(props){
    super(props);

    this.state = {
      loggedIn: this.checkStatus(),
      goHome: false,
      goToMessages: false,
      input: this.getAnalysis()
    }
  }

  getAnalysis() {
    return this.props.heartbeat.pendingAnalysis ? this.props.heartbeat.pendingAnalysis : '';
  }

  submitAnalysis() {
    $.post(
      'https://heartbeat-heroku.herokuapp.com/sendAnalysis', 
      { 
        'name': this.props.heartbeat.name,
        'pendingAnalysis': this.state.input
      }, 
      (res, status) => {
        this.setState({goHome: true});
      });
  }

  checkStatus() {
    return this.props.user.name.length > 0;
  }

  logOut = () => {
    this.props.logoutUser();
    this.setState({
      loggedIn: false
    })
  }

  renderRedirect = () => {
    if (!this.state.loggedIn) {
      return <Redirect to='/login' />
    }
  }

  navigateHome() {
    this.setState({
      goHome: true
    })
  }

  renderHome = () => {
    if (this.state.goHome) {
      return <Redirect to='/' />
    }
  }

  navigateMessages() {
    this.setState({
      goToMessages: true
    })
  }

  redirectMessages = () => {
    if (this.state.goToMessages) {
      return <Redirect to='/messages' />
    }
  }

  render() {
    return (
      <div>
        {this.renderRedirect()}
        {this.renderHome()}
        {this.redirectMessages()}
        <div className="Header" style={{paddingTop: 50}}>
          <img alt="" src={heart}/>
        </div>
        <div style={{textAlign: 'center', marginBottom: 20}}>
          <span style={{fontSize: 20}}>{this.props.heartbeat.name}</span>
        </div>
        <div className="textContainer">
          <div style={{textAlign: 'center', marginBottom: 20, marginTop: 10}}>
            <span>Approved analysis</span>
          </div>
          <p className="analysisText">
            {this.props.heartbeat.approovedAnalysis ? this.props.heartbeat.approovedAnalysis : '...'}
          </p>
        </div>
        <div className="textContainer">
          <div style={{textAlign: 'center', marginBottom: 20, marginTop: 20}}>
            <span>Pending analysis</span>
          </div>
          <div className="inputAnalysis">
            <textarea 
              style={{width: '100%'}}
              cols="40" 
              rows="5"
              onChange={(e) => this.setState({input: e.target.value})} 
              value={this.state.input}
            />
          </div>
        </div>
        <div className="submitButtonContainer">
          <button className="submitButton" onClick={this.submitAnalysis.bind(this)}>Siusti</button>
        </div>
        <div className="footer">
          <img onClick={this.navigateMessages.bind(this)} className="message" src={message} alt=""/>
          <button onClick={this.navigateHome.bind(this)} className="homeButton">Pagrindinis</button>
          <button onClick={this.logOut.bind(this)} className="logout">Atsijungti</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    user: state.user,
    heartbeat: state.beats.activeHeartbeat
  }
};

export default connect(mapStateToProps, {logoutUser: logout})(Analysis);
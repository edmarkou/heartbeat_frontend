import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Analysis.css';
import heart from '../assets/images/heart.png';
import message from '../assets/images/message.png';
import { connect } from 'react-redux';
import { logout } from '../actions/userActions';
import { attachHeartbeats, attachSelectedHeartbeat } from '../actions/heartbeatActions';

class Analysis extends Component {
  constructor(props){
    super(props);

    this.state = {
      loggedIn: this.checkStatus(),
      goHome: false,
      goToMessages: false,
    }
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

  submitAnalysis() {
    const heartbeats = this.props.heartbeats.filter(beat => beat.name !== this.props.heartbeat.name);
    this.props.attachHeartbeats(heartbeats);
    this.setState({goHome: true});
    this.props.attachSelectedHeartbeat({});
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
          <p className="analysisText">
            {this.props.heartbeat.approovedAnalysis ? this.props.heartbeat.approovedAnalysis : ''}
          </p>
        </div>
        {this.props.user.userType === 'A' ? 
          <div className="submitButtonContainer">
            <button className="submitButton" onClick={this.submitAnalysis.bind(this)}>Patvirtinti</button>
          </div> : null
        }
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
    heartbeat: state.beats.activeHeartbeat,
    heartbeats: state.beats.heartbeats
  }
};

export default connect(mapStateToProps, 
  {
    logoutUser: logout, 
    attachHeartbeats: attachHeartbeats,
    attachSelectedHeartbeat: attachSelectedHeartbeat
  })(Analysis);
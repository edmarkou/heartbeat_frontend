import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Analysis.css';
import heart from '../assets/images/heart.png';
import message from '../assets/images/message.png';
import { connect } from 'react-redux';
import { logout } from '../actions/userActions';

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
          <span style={{fontSize: 20}}>{this.props.ritmograma.name}</span>
        </div>
        <div className="textContainer">
          <p className="analysisText">
            {this.props.ritmograma.analysis}
          </p>
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
    ritmograma: state.ritmograma
  }
};

export default connect(mapStateToProps, {logoutUser: logout})(Analysis);
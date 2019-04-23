import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Messages.css';
import heart from '../assets/images/heart.png';
import { connect } from 'react-redux';

class Messages extends Component {
  constructor(props){
    super(props);

    this.state = {
      loggedIn: this.checkStatus(),
      goHome: false
    }
  }

  checkStatus() {
    return this.props.user.name.length > 0;
  }

  logout = () => {
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

  render() {
    return (
      <div>
        {this.renderRedirect()}
        {this.renderHome()}
        <div className="Header" style={{paddingTop: 50}}>
          <img alt="" src={heart}/>
        </div>
        <div style={{textAlign: 'center', marginBottom: 20}}>
          <span style={{fontSize: 20}}>Zinutes</span>
        </div>
        <div className="container">
          
        </div>
        <div className="footer">
          <button onClick={this.navigateHome.bind(this)} className="homeButton">Pagrindinis</button>
          <button onClick={this.logout.bind(this)} className="logout">Atsijungti</button>
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

export default connect(mapStateToProps)(Messages);
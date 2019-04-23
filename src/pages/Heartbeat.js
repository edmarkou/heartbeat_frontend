import React, { Component } from 'react';
import { Chart } from "react-charts";
import { Redirect } from 'react-router-dom';
import './Heartbeat.css';
import heart from '../assets/images/heart.png';
import message from '../assets/images/message.png';
import { connect } from 'react-redux';

class Heartbeat extends Component {
  constructor(props){
    super(props);

    this.state = {
      clicked: 1,
      loggedIn: this.checkStatus(),
      goToMessages: false
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
        {this.redirectMessages()}
        <div className="Header" style={{paddingTop: 50}}>
          <img alt="" src={heart}/>
        </div>
        <div className="containerTab">
          <span 
            className="span" 
            style={this.state.clicked === 1 ? {color: '#fff', backgroundColor: '#000'} : null}
            onClick={() => this.setState({clicked: 1})}
          >
            Ikelit nauja ritmograma
          </span>
          <span 
            className="span" 
            style={this.state.clicked === 2 ? {color: '#fff', backgroundColor: '#000'} : null}
            onClick={() => this.setState({clicked: 2})}
          >
            Perziureti ritmogramu istorija
          </span>
        </div>
        {this.state.clicked === 1 ? 
          <div className="container" style={{textAlign: 'center', flexDirection: 'column'}}>
            <span className="inputTitle">Ikelti nauja ritmogramos .hrm faila</span><br/>
            <input type="file" className="fileInput"/>
          </div>
          :
          <div className="container">
            <div className="listContainer">
              <span className="listItem">Tomas Tomaitis, Ritmograma nr.1</span>
            </div>
            <div className="heartbeatContainer">
              <span className="ritmograma">Ritmograma nr.1</span>
              <div
                style={{
                  width: "90%",
                  height: "150px",
                }}
              >
                <Chart
                  data={[
                    {
                      label: "Heartbeat",
                      data: [[0.1, 3], [0.2, 1], [0.3, 6], [0.4, 4], [0.5, 3], [0.6, 1], [0.7, 5], [0.8, 6], [0.9, 4], [1, 3], [1.1, 1], [1.2, 5], [1.3, 6], [1.4, 4],[1.5, 3], [1.6, 1], [1.7, 5], [1.8, 6], [1.9, 4]]
                    }
                  ]}
                  axes={[
                    { primary: true, type: "linear", position: "bottom" },
                    { type: "linear", position: "left" }
                  ]}
                />
              </div>
              <button className="analizeButton">Atlikti ritmogramos analize</button>
              {this.props.user.userType === 'expert' ? <button className="analizeButton">Ritmogramos analize</button> : null}
            </div>
          </div>
        }
        <div className="footer">
          <img onClick={this.navigateMessages.bind(this)} className="messageButton" src={message} alt=""/>
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

export default connect(mapStateToProps)(Heartbeat);
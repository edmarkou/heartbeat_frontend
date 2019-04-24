import React, { Component } from 'react';
import { Chart } from "react-charts";
import { Redirect } from 'react-router-dom';
import './Heartbeat.css';
import heart from '../assets/images/heart.png';
import message from '../assets/images/message.png';
import { connect } from 'react-redux';
import { logout } from '../actions/userActions';

const ritmogramos = [
  {
    name: 'Tomas Tomaitis Ritmograma Nr.1',
    data: [[0.1, 891], [0.2, 871], [0.3, 891], [0.4, 901], [0.5, 911], [0.6, 881], [0.7, 891], [0.8, 851], [0.9, 861], [1, 801], [1.1, 871], [1.2, 875], [1.3, 906], [1.4, 904],[1.5, 893], [1.6, 871], [1.7, 915], [1.8, 916], [1.9, 894]]
  }, 
  {
    name: 'Tomas Tomaitis Ritmograma Nr.2',
    data: [[0.1, 2], [0.2, 1], [0.3, 6], [0.4, 1], [0.5, 1], [0.6, 6], [0.7, 5], [0.8, 6], [0.9, 2], [1, 3], [1.1, 1], [1.2, 5], [1.3, 6], [1.4, 4],[1.5, 3], [1.6, 1], [1.7, 5], [1.8, 6], [1.9, 4]]
  }, 
  {
    name: 'Tomas Tomaitis Ritmograma Nr.3',
    data: [[0.1, 3], [0.2, 1], [0.3, 0], [0.4, 4], [0.5, 1], [0.6, 1], [0.7, 5], [0.8, 4], [0.9, 4], [1, 3], [1.1, 1], [1.2, 5], [1.3, 6], [1.4, 4],[1.5, 3], [1.6, 1], [1.7, 5], [1.8, 6], [1.9, 4]]
  }, 
];

class Heartbeat extends Component {
  constructor(props){
    super(props);

    this.state = {
      clicked: 'ritmograma',
      loggedIn: this.checkStatus(),
      goToMessages: false,
      goToAnalysis: false,
      selected: 0
    }
  }

  checkStatus() {
    console.log(this.props.user.name);
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

  navigateAnalysis() {
    this.setState({
      goToAnalysis: true
    })
  }

  redirectAnalysis = () => {
    if (this.state.goToAnalysis) {
      return <Redirect to='/analysis' />
    }
  }

  renderComponent() {
    if (this.state.clicked === 'import') {
      return (
        <div className="container" style={{textAlign: 'center', flexDirection: 'column'}}>
          <span className="inputTitle">Ikelti nauja ritmogramos .hrm faila</span><br/>
          <input type="file" className="fileInput"/>
        </div>
      )
    } else if (this.state.clicked === 'ritmograma') {
      return (
        <div className="container">
          <div className="listContainer">
            {ritmogramos.map((ritmograma, index) => {
              return (
                <span 
                  className="listItem" 
                  style={this.state.selected === index ? {backgroundColor: 'aqua'} : null}
                  onClick={() => this.setState({selected: index})}
                >
                  {ritmograma.name}
                </span>
              )
            })}
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
                    data: ritmogramos[this.state.selected].data
                  }
                ]}
                axes={[
                  { primary: true, type: "linear", position: "bottom" },
                  { type: "linear", position: "left" }
                ]}
              />
            </div>
            <button className="analizeButton" onClick={this.navigateAnalysis.bind(this)}>Ritmogramos analize</button>
            {this.props.user.userType === 'E' ? <button className="analizeButton">Atlikti ritmogramos analize</button> : null}
          </div>
        </div>
      )
    } else return null;
  }

  render() {
    return (
      <div>
        {this.renderRedirect()}
        {this.redirectMessages()}
        {this.redirectAnalysis()}
        <div className="Header" style={{paddingTop: 50}}>
          <img alt="" src={heart}/>
        </div>
        {this.props.user.userType === 'E' ?
          <div className="containerTab">
            <span 
              className="span" 
              style={this.state.clicked === 'ritmograma' ? {color: '#fff', backgroundColor: '#000'} : null}
              onClick={() => this.setState({clicked: 'ritmograma'})}
            >
              Perziureti ritmogramu istorija
            </span>
          </div>
        :
          <div className="containerTab">
          <span 
            className="span" 
            style={this.state.clicked === 'import' ? {color: '#fff', backgroundColor: '#000'} : null}
            onClick={() => this.setState({clicked: 'import'})}
          >
            Ikelit nauja ritmograma
          </span>
          <span 
            className="span" 
            style={this.state.clicked === 'ritmograma' ? {color: '#fff', backgroundColor: '#000'} : null}
            onClick={() => this.setState({clicked: 'ritmograma'})}
          >
            Perziureti ritmogramu istorija
          </span>
        </div>
        }
        {this.renderComponent()}
        <div className="footer">
          <img onClick={this.navigateMessages.bind(this)} className="messageButton" src={message} alt=""/>
          <button onClick={this.logOut.bind(this)} className="logout">Atsijungti</button>
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

export default connect(mapStateToProps, { logoutUser: logout })(Heartbeat);
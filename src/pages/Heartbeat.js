import React, { Component } from 'react';
import { Chart } from "react-charts";
import { Redirect } from 'react-router-dom';
import './Heartbeat.css';
import heart from '../assets/images/heart.png';
import message from '../assets/images/message.png';
import { connect } from 'react-redux';
import { logout, attachUsers, attachExperts } from '../actions/userActions';
import { attachHeartbeats, attachSelectedHeartbeat } from '../actions/heartbeatActions';
import $ from 'jquery';

class Heartbeat extends Component {
  constructor(props){
    super(props);

    this.state = {
      clicked: 'ritmograma',
      loggedIn: this.checkStatus(),
      goToMessages: false,
      goToAnalysis: false,
      goToAnalyze: false,
      selected: 0,
      heartbeatData: []
    }
  }

  componentWillMount() {
    if (this.props.user.userType === 'A') {
      $.get('https://heartbeat-heroku.herokuapp.com/getAllApprovedUsers', (users, status) => { 
        this.props.attachUsers(users);
      });
      $.get('https://heartbeat-heroku.herokuapp.com/getAllNotApprovedExperts', (users, status) => { 
        this.props.attachExperts(users);
      });
      $.get(`https://heartbeat-heroku.herokuapp.com/getAllPendingAnalysis`, (heartbeats, status) => {
        this.props.attachHeartbeats(heartbeats);
      });
    } else if (this.props.user.userType === 'U') {
      $.get(`https://heartbeat-heroku.herokuapp.com/heartbeat?userId=${this.props.user.id}`, (heartbeats, status) => {
        this.props.attachHeartbeats(heartbeats);
      });
    } else if (this.props.user.userType === 'E') {
      $.get(`https://heartbeat-heroku.herokuapp.com/getAllHeartbeats`, (heartbeats, status) => {
        this.props.attachHeartbeats(heartbeats);
      });
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
    this.props.attachSelectedHeartbeat(this.props.beats.heartbeats[this.state.selected]);
    this.setState({
      goToAnalysis: true
    })
  }

  redirectAnalysis = () => {
    if (this.state.goToAnalysis) {
      return <Redirect to='/analysis' />
    }
  }

  redirectAnalyze() {
    if (this.state.goToAnalyze) {
      return <Redirect to='/analyze' />
    }
  }

  approveUser(expert) {
    const experts = this.props.experts.filter(user => user.id !== expert.id);
    let allUsers = this.props.allUsers;
    allUsers.unshift(expert);
    $.post(
      'https://heartbeat-heroku.herokuapp.com/approveUser', 
      { 'userId': expert.id }, 
      (res, status) => {
        this.props.attachExperts(experts);
        this.props.attachUsers(allUsers);
      });
  }

  deleteExpert(expert) {
    const experts = this.props.experts.filter(user => user.id !== expert.id);
    $.ajax({
      type: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      url: 'https://heartbeat-heroku.herokuapp.com/deleteUser?userId=' + expert.id, 
      success: (res, status) => {
        this.props.attachExperts(experts);
      },
      error: (data) => {
        console.log(data);
      }
    });
  }

  deleteUser(userToDelete) {
    const users = this.props.allUsers.filter(user => user.id !== userToDelete.id);
    $.ajax({
      type: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      url: 'https://heartbeat-heroku.herokuapp.com/deleteUser?userId=' + userToDelete.id,
      success: (res, status) => {
        this.props.attachUsers(users);
      },
      error: (data) => {
        console.log(data);
      }
    })
  }

  getFile(e) {
    const self = this;
    const file = e.target.files[0];
    if (file.type === "text/plain") {
      var reader = new FileReader();
      reader.onload = function(event) {
        self.setState({heartbeatData: event.target.result.split('\n')});
      };
      reader.readAsText(file);
    }
  }

  uploadFile() {
    const data = {
      userId: this.props.user.id,
      heartbeatData: this.state.heartbeatData,
      name: `${this.props.user.name} ${this.props.user.lastName} (${Math.floor(Math.random() * 1000)})`
    }
    $.ajax({
      'type': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'url': 'https://heartbeat-heroku.herokuapp.com/addHeartbeat', 
      'data': JSON.stringify(data),
      'success': (res, status) => {
        const array = [data, ...this.props.beats.heartbeats];
        this.props.attachHeartbeats(array);
        this.setState({heartbeatData: []});
      }
    });
  }

  doAnalysis() {
    this.props.attachSelectedHeartbeat(this.props.beats.heartbeats[this.state.selected]);
    this.setState({goToAnalyze: true});
  }

  getBeats(data) {
    let array = [];
    data.forEach((beat, index) => {
      array.push([index, beat]);
    });
    return array;
  }

  renderTabs() {
    if (this.props.user.userType === 'E') {
      return (
        <div className="containerTab">
          <span 
            className="span" 
            style={this.state.clicked === 'ritmograma' ? {color: '#fff', backgroundColor: '#000'} : null}
            onClick={() => this.setState({clicked: 'ritmograma'})}
          >
            Perziureti ritmogramas
          </span>
        </div>
      )
    } else if (this.props.user.userType === 'U') {
      return (
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
      )
    } else if (this.props.user.userType === 'A') {
      return (
        <div className="containerTab">
          <span 
            className="span" 
            style={this.state.clicked === 'ritmograma' ? {color: '#fff', backgroundColor: '#000'} : null}
            onClick={() => this.setState({clicked: 'ritmograma'})}
          >
            Perziureti ritmogramu istorija
          </span>
          <span 
            className="span" 
            style={this.state.clicked === 'vartotojai' ? {color: '#fff', backgroundColor: '#000'} : null}
            onClick={() => this.setState({clicked: 'vartotojai'})}
          >
            Vartotojai
          </span><span 
            className="span" 
            style={this.state.clicked === 'registracijos' ? {color: '#fff', backgroundColor: '#000'} : null}
            onClick={() => this.setState({clicked: 'registracijos'})}
          >
            Registracijos
          </span>
        </div>
      )
    } else return null;
  }

  renderComponent() {
    const { selected, clicked, heartbeatData } = this.state;
    if (clicked === 'import') {
      return (
        <div className="container" style={{textAlign: 'center', flexDirection: 'column'}}>
          <span className="inputTitle">Ikelti nauja ritmogramos .hrm faila</span><br/>
          <input onChange={(e) => this.getFile(e)} type="file" className="fileInput"/>
          {heartbeatData.length > 0 ? 
            <div>
              <button className="analizeButton" onClick={this.uploadFile.bind(this)}>
                Ikelti ritmograma
              </button>
            </div> : null
          }
        </div>
      )
    } else if (clicked === 'ritmograma') {
      return (
        <div className="container">
          <div className="listContainer">
            {this.props.beats.heartbeats.map((heartbeat, index) => {
              return (
                <span 
                  key={index}
                  className="listItem" 
                  style={selected === index ? {backgroundColor: 'aqua'} : null}
                  onClick={() => this.setState({selected: index})}
                >
                  {heartbeat.name}
                </span>
              )
            })}
          </div>
          {this.props.beats.heartbeats[selected] ? 
            <div className="heartbeatContainer">
              <span className="ritmograma">{this.props.beats.heartbeats[selected].name}</span>
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
                      data: this.getBeats(this.props.beats.heartbeats[selected].heartbeatData)
                    }
                  ]}
                  axes={[
                    { primary: true, type: "linear", position: "bottom" },
                    { type: "linear", position: "left" }
                  ]}
                />
              </div>
              <button className="analizeButton" onClick={this.navigateAnalysis.bind(this)}>Ritmogramos analize</button>
              {this.props.user.userType === 'E' ? <button className="analizeButton" onClick={this.doAnalysis.bind(this)}>Atlikti ritmogramos analize</button> : null}
            </div> : null
          }
        </div>
      )
    } else if (clicked === 'vartotojai') {
      return (
        <div className="container">
          <div className="listContainer">
            {this.props.allUsers.map((user, index) => {
              return (
                <span 
                  key={index}
                  className="listItem"
                  style={selected === index ? {backgroundColor: 'aqua', textAlign: 'start'} : {textAlign: 'start'}}
                  onClick={() => this.setState({selected: index})}
                >
                  {user.name}
                </span>
              )
            })}
          </div>
          {this.props.allUsers[selected] ? 
          <div className="userInfo">
            <div className={'userInfoItem'}>
              <div className={'userInfoDiv'}>
                <span className={'userInfoKey'}>Vardas:</span>
              </div>
              <div className={'userInfoDiv'}>
                <span className={'userInfoString'}>{this.props.allUsers[selected].name}</span>
              </div>
            </div>
            <div className={'userInfoItem'}>
              <div className={'userInfoDiv'}>
                <span className={'userInfoKey'}>Pavarde:</span>
              </div>
              <div className={'userInfoDiv'}>
                <span className={'userInfoString'}>{this.props.allUsers[selected].lastName}</span>
              </div>
            </div>
            <div className={'userInfoItem'}>
              <div className={'userInfoDiv'}>
                <span className={'userInfoKey'}>Vartotojo tipas:</span>
              </div>
              <div className={'userInfoDiv'}>
                <span className={'userInfoString'}>{this.props.allUsers[selected].userType}</span>
              </div>
            </div>
            {this.props.allUsers[selected].userType === 'E' ?
              <div className={'userInfoItem'}>
                <div className={'userInfoDiv'}>
                  <span className={'userInfoKey'}>Patirtis:</span>
                </div>
                <div className={'userInfoDiv'}>
                  <span className={'userInfoString'}>{this.props.allUsers[selected].experience} m.</span>
                </div>
              </div> : null
            }
            {this.props.allUsers[selected].userType === 'E' ?
              <div className={'userInfoItem'}>
                <div className={'userInfoDiv'}>
                  <span className={'userInfoKey'}>Numeris:</span>
                </div>
                <div className={'userInfoDiv'}>
                  <span className={'userInfoString'}>{this.props.allUsers[selected].licenceNumber}</span>
                </div>
              </div> : null
            }
            <div className={'userInfoItem'}>
              <div className={'userInfoDiv'}>
                <button className={'writeMessage'}>Rasyti zinute</button>
              </div>
              <div className={'userInfoDiv'}>
                <button className={'deleteAccount'} onClick={() => this.deleteUser(this.props.allUsers[selected])}>Trinti paskyra</button>
              </div>
            </div>
          </div> : null}
        </div>
      )
    } else if (clicked === 'registracijos') {
      return (
        <div className="container">
          <div className="listContainer">
            {this.props.experts.map((user, index) => {
              return (
                <span 
                  key={index}
                  className="listItem"
                  style={selected === index ? {backgroundColor: 'aqua', textAlign: 'start'} : {textAlign: 'start'}}
                  onClick={() => this.setState({selected: index})}
                >
                  {user.name}
                </span>
              )
            })}
          </div>
          {this.props.experts[selected] ? 
          <div className="userInfo">
            <div className={'userInfoItem'}>
              <div className={'userInfoDiv'}>
                <span className={'userInfoKey'}>Vardas:</span>
              </div>
              <div className={'userInfoDiv'}>
                <span className={'userInfoString'}>{this.props.experts[selected].name}</span>
              </div>
            </div>
            <div className={'userInfoItem'}>
              <div className={'userInfoDiv'}>
                <span className={'userInfoKey'}>Pavarde:</span>
              </div>
              <div className={'userInfoDiv'}>
                <span className={'userInfoString'}>{this.props.experts[selected].lastName}</span>
              </div>
            </div>
            <div className={'userInfoItem'}>
              <div className={'userInfoDiv'}>
                <span className={'userInfoKey'}>Patirtis:</span>
              </div>
              <div className={'userInfoDiv'}>
                <span className={'userInfoString'}>{this.props.experts[selected].experience} m.</span>
              </div>
            </div>
            <div className={'userInfoItem'}>
              <div className={'userInfoDiv'}>
                <span className={'userInfoKey'}>Numeris:</span>
              </div>
              <div className={'userInfoDiv'}>
                <span className={'userInfoString'}>{this.props.experts[selected].licenceNumber}</span>
              </div>
            </div>
            <div className={'userInfoItem'}>
              <div className={'userInfoDiv'}>
                <button className={'writeMessage'} onClick={() => this.approveUser(this.props.experts[selected])}>Patvirtinti</button>
              </div>
              <div className={'userInfoDiv'}>
                <button className={'deleteAccount'} onClick={() => this.deleteExpert(this.props.experts[selected])}>Trinti paskyra</button>
              </div>
            </div>
          </div> : null}
        </div>
      )
    } else return null;
  }

  render() {

    if (!this.state.loggedIn) {
      return <Redirect to={'/login'}/>
    }

    return (
      <div>
        {this.redirectMessages()}
        {this.redirectAnalysis()}
        {this.redirectAnalyze()}
        <div className="Header" style={{paddingTop: 50}}>
          <img alt="" src={heart}/>
        </div>
        {this.renderTabs()}
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
    user: state.user,
    allUsers: state.allUsers.users,
    experts: state.allUsers.experts,
    beats: state.beats
  }
};

const mapActionToProps = {
  attachExperts: attachExperts,
  logoutUser: logout,
  attachUsers: attachUsers,
  attachHeartbeats: attachHeartbeats,
  attachSelectedHeartbeat: attachSelectedHeartbeat
}

export default connect(mapStateToProps, mapActionToProps)(Heartbeat);
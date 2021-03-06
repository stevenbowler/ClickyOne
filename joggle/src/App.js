import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './App.css';
import Box from './components/Box';
import { Container } from 'reactstrap';
import AppNavbar from './components/AppNavbar';
import LoginRegisterModals from './components/LoginRegisterModals';
import LeaderBoardModal from './components/LeaderBoardModal';


//
//  To do Jan. 10, 2020: User Authorization updates required
//        handleLogin if login not authorized leaves loginModal fields green on retry (Done Jan. 10)
//              LoginModal handleSubmit w preventDefault corrects but lose user message "not logged in" on Navbar
//        pass back body of messages from routes/users.js currently just 400 status, message would help user
//        only accepts .com and .net extensions due to TLD limitations in @hapi/joi string.email
//        server.js at bottom for environment should be app.use and app.get instead of appluse and applget?
//          


// const parsePX = (pxString) => Number(pxString.slice(pxString, -2, 2)); // parse out "px" return integer
const parseS = (sString) => Number(sString.slice(sString, -1, 1));     // parse out "s" return integer
const boxFactor = "50px";           //Box Width Height Growth Factor
// const maxLevelTimer = 6;           //seconds per level
const maxLevel = 20;                // handleEndGame after finishing this level
const originalFuelThiefTransition = "15s";
document.body.style = 'background: black;';
// Or with CSS
// document.body.classList.add('background-red');


class App extends React.Component {
  constructor(props) {
    super(props);
    this.fuel = 100;
    this.level = 1;
    this.score = 0;
    this.levelTimer = 0;
    this.fuelThiefTransition = originalFuelThiefTransition;
    this.levelTransitionFactor = (parseS(this.fuelThiefTransition) - 3) / maxLevel;
    this.loggedIn = false;
    this.name = "";
    this.timerOn = false;
    this.gamesData = {
      userBestScore: 0,
      userBestLevel: 0,
      bestScore: 0,
      bestScoreName: 0,
      bestLevel: 0,
      bestLevelName: 0
    };
    this.state = {
      height: "60%",                // Box height
      width: "100%",                 // Box width
      backgroundColor: "black",   // "#bf5700" Box color, from brand.utexas.edu
      grow: "true",                 // currently disabled grow shrink
      isOpenNavBar: false,
      isOpenLoginModal: false,
      isOpenRegisterModal: false,
      isOpenLeaderBoardModal: false,
      name: "Guest...Log In",
      token: "",
      email: "",
      gameOn: false,
      loggedIn: false,
      finalScore: 0,
      finalLevel: 0
    };
  }


  // LIFECYCLE METHODS and related support functions

  componentDidMount() {
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {
  }

  // called from lifecycle methods
  gameUpdate = () => {
    console.log("gameUpdate gameOn: ");

  }



  // STATE HANDLERS and related support functions FROM COMPONENTS

  // handle state.isOpenNavBar toggle for ReactStrap AppNavBar 
  handleToggleNavbar = () => {
    this.setState({ isOpenNavBar: !this.state.isOpenNavBar });
    if (this.state.isOpenNavBar) this.setState({ gameOn: false });
  }

  // handle state.isOpenNavBar toggle for ReactStrap AppNavBar 
  handleToggleLeaderBoardModal = (userBestScore) => {
    // console.log("handleToggleLeaderBoard userBestScore:", userBestScore);
    if (userBestScore > this.state.finalScore) this.setState({ finalScore: userBestScore });
    this.setState({ isOpenRegisterModal: false });
    this.setState({ isOpenLoginModal: false });
    this.setState({ isOpenLeaderBoardModal: !this.state.isOpenLeaderBoardModal });
  }


  // handle state.isOpenNavBar toggle for ReactStrap AppNavBar 
  handleToggleLoginRegisterModal = () => {
    this.setState({ isOpenRegisterModal: !this.state.isOpenRegisterModal });
    this.setState({ isOpenLoginModal: false });
    this.setState({ isOpenLeaderBoardModal: false });
  }


  // handle state.isOpenNavBar toggle for ReactStrap AppNavBar 
  handleToggleLoginModal = () => {
    this.setState({ isOpenRegisterModal: !this.state.isOpenRegisterModal });
    this.setState({ isOpenLeaderBoardModal: false });
    this.setState({ isOpenLoginModal: !this.state.isOpenLoginModal });
  }



  // called from LoginRegisterModals component to handle registration request attribute changes
  handleRegister = (data) => {

    axios
      .post(
        '/api/users/register',
        {
          name: data.name,
          email: data.email,
          password: data.password
        })
      .then(response => {
        console.log(`register user: ${response.data.name} ${response.data.date}`);

        axios
          .post(
            '/api/users/login',
            {
              email: data.email,
              password: data.password
            })
          .then(res => {
            console.log(`login user: ${res.data.user.name}`);
            this.setState({ name: res.data.user.name }); // will display name on Navbar
            this.setState({ token: res.data.token }); // will display name on Navbar
            this.setState({ email: data.email }); // will display name on Navbar
            this.setState({ loggedIn: true });
            this.handleToggleLoginModal();
          })
          .catch(error => {
            console.log("handleLogin catch errorResponse :" + error);
            this.setState({ name: "wrong email or pswd" }); // will display error message on Navbar
            this.handleToggleLoginModal();
          });


      })
      .catch(function (error) {
        console.log(" Could not register from App.js: " + error.message);
      });
  }


  handleLogin = (data) => {

    axios
      .post(
        '/api/users/login',
        {
          email: data.email,
          password: data.password
        })
      .then(response => {
        console.log(`login user: ${response.data.user.name}`);
        this.setState({ name: response.data.user.name }); // will display name on Navbar
        this.setState({ token: response.data.token }); // will display name on Navbar
        this.setState({ email: data.email }); // will display name on Navbar
        this.setState({ loggedIn: true });
        this.handleToggleLoginModal();
      })
      .catch(error => {
        console.log("handleLogin catch errorResponse :" + error);
        this.setState({ name: "wrong email or pswd" }); // will display error message on Navbar
        this.handleToggleLoginModal();
      });
  }


  handleLogout = () => {
    console.log(`logout: ${this.state.name}`);
    this.setState({ name: "Logged out" });
    this.setState({ loggedIn: false });
    this.setState({ finalScore: 0 });
    this.setState({ finalLevel: 0 });
  }


  handleEndGame = () => {

  }


  handleChangeColor = () => {
    var randomRed = Math.floor(Math.random() * 255);
    var randomGreen = Math.floor(Math.random() * 255);
    var randomBlue = Math.floor(Math.random() * 255);
    document.body.style = `transition: background-color 10s;`
    document.body.style = `background-color: rgb(${randomRed}, ${randomGreen}, ${randomBlue});`;
    this.setState({ backgroundColor: `rgb(${randomRed}, ${randomGreen}, ${randomBlue})` });
  }
  handleTutorial = () => {
    console.log("handleTutorial");
    window.location.href = "https://drive.google.com/file/d/1JP_OVqQBgVvdr6Cqqd9xBg2_fPOLpMeB/view";
    // https://drive.google.com/file/d/1JP_OVqQBgVvdr6Cqqd9xBg2_fPOLpMeB/view
  }
  handleUnsued = () => console.log("handleUnused");

  // grow or shrink the Box with + or - factor value
  changeSize = () => {
    console.log("changeSize doesn't do anything anymore");
  }

  handleNewBestScore = (newBestScore) => {
    // console.log("newBestScore App.js line 227: ", newBestScore);
    if (this.state.loggedIn && newBestScore > this.state.finalScore) this.setState({ finalScore: newBestScore });
    if (this.state.loggedIn) this.handleToggleLeaderBoardModal();
    else console.log("not logged in so didn't open top 5 modal with: ", newBestScore);
  }




  render() {
    return (
      <div className="App">
        <AppNavbar
          name={this.state.name}
          loggedIn={this.state.loggedIn}
          isOpen={this.state.isOpenNavBar}
          onRegister={this.handleToggleLoginRegisterModal}
          onLogin={this.handleToggleLoginModal}
          onLogout={this.handleLogout}
          onLeaderBoard={this.handleToggleLeaderBoardModal}
          onEndGame={this.handleEndGame}
          onToggle={this.handleToggleNavbar}
          onTutorial={this.handleTutorial}
          onUnused={this.handleUnused}
          onChangeColor={this.handleChangeColor}
        />
        <LoginRegisterModals
          isOpenLoginModal={this.state.isOpenLoginModal}
          isOpenRegisterModal={this.state.isOpenRegisterModal}
          onCancel={this.handleToggleLoginRegisterModal}
          onRegister={this.handleRegister}
          onLogin={this.handleLogin}
          name={this.state.name}
          email={this.state.email}
        />
        <LeaderBoardModal
          loggedIn={this.state.loggedIn}
          onLogout={this.handleLogout}
          isOpenLeaderBoardModal={this.state.isOpenLeaderBoardModal}
          onCancel={this.handleToggleLeaderBoardModal}
          token={this.state.token}
          email={this.state.email}
          userName={this.state.name}
          score={this.state.finalScore}
          level={this.state.finalLevel}
        />
        <Container>
          <Box
            delta={boxFactor}
            onNewBestScore={this.handleNewBestScore}
            height={this.state.height}
            width={this.state.width}
            backgroundColor={this.state.backgroundColor}
            fontSize={this.state.fontSize}
            loggedIn={this.state.loggedIn}
            score={this.state.finalScore}
          />
        </Container>
      </div>
    );
  }
}

export default App;

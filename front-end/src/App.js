import React, {Component} from "react";
import {ABOUT, HOME, POSTS, LOGIN, REGISTER} from "./Utils/Constants"
import HomeView from "./CustomComponents/HomeView";
import AboutView from "./CustomComponents/AboutView";
import PostsView from "./CustomComponents/PostsView";
import LoginView from "./CustomComponents/LoginView";
import RegisterView from "./CustomComponents/RegisterView";
import {Nav, Navbar} from "react-bootstrap";
// import cookie here

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CurrentPage: HOME, // Posts: 1,
            status: {
                success: null,
                msg: ""
            },
            user: null
        };
        this.updateState = this.updateState.bind(this);
    }

    updateState(newState) {
        this.setState(newState);
    }

    GetView(state) {
        const page = state.CurrentPage;
        switch (page) {
            case HOME:
                return <HomeView/>;
            case ABOUT:
                return <AboutView/>
            case POSTS:
                return <PostsView appState={this.state} />
            case LOGIN:
                return <LoginView appState={this.state} updateState={this.updateState} />
            case REGISTER:
                return <RegisterView/>
            default:
                return <HomeView/>;
        }
    };

    SetView = (obj) => {
        this.setState({CurrentPage: obj.page /*, Posts: obj.id || 0 */});
    };

    render() {
        return (<div id="APP" className="container">
            <div id="menu" className="row">

                <Navbar className="navbar navbar-expand-lg navbar-dark" bg="primary" expand="lg">
                    <div className="container-fluid">
                        <Navbar.Brand
                            onClick={this.SetView.bind(this, {page: HOME})}
                            href="#home">Tech Skill Swap</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link
                                    onClick={this.SetView.bind(this, {page: HOME})}
                                    href="#home">Home</Nav.Link>
                                <Nav.Link
                                    onClick={this.SetView.bind(this, {page: ABOUT})}
                                    href="#about">About</Nav.Link>
                                <Nav.Link
                                    onClick={this.SetView.bind(this, {page: POSTS})}
                                    href="#posts">Posts</Nav.Link>
                                <Nav.Link
                                    onClick={this.SetView.bind(this, {page: REGISTER})}
                                    href="#register">Register</Nav.Link>
                                <Nav.Link
                                    onClick={this.SetView.bind(this, {page: LOGIN})}
                                    href="#login">Login</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </div>
                </Navbar>

            </div>
            <div id="viewer" className="row container">
                {this.GetView(this.state)}
            </div>
        </div>);
    }
}

export default App;
import React, {Component} from "react"
import {Nav, Navbar} from "react-bootstrap"
import {ABOUT, HOME, POSTS, POST, LOGIN, REGISTER, ADDPOST, RESETPW, USERINFO} from "./Utils/Constants"
import HomeView from "./CustomComponents/HomeView"
import AboutView from "./CustomComponents/AboutView"
import PostsView from "./CustomComponents/PostsView"
import LoginView from "./CustomComponents/LoginView"
import RegisterView from "./CustomComponents/RegisterView"
import OnePostView from "./CustomComponents/OnePostView"
import AddPostView from "./CustomComponents/AddPostView"
import ResetPasswordView from "./CustomComponents/ResetPasswordView"
import PasswordResetRouterView from "./CustomComponents/PasswordResetRouterView"
import UserInfoSetupView from "./CustomComponents/UserInfoSetupView"

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {useNavigate} from 'react-router-dom';


// import cookie here

class App extends Component {
    constructor(props) {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        const loggedIn = localStorage.getItem('loggedIn')

        super(props)
        this.state = {
            CurrentPage: HOME, status: {
                success: null, msg: ""
            }, user: null, id: null, loggedIn: !!(token && user && loggedIn),
        }
        this.updateStateApp = this.updateStateApp.bind(this)
    }

    updateStateApp(newState) {
        this.setState(newState)
    }

    GetView(state) {
        const page = state.CurrentPage
        switch (page) {
            case HOME:
                return <HomeView/>
            case ABOUT:
                return <AboutView/>
            case POSTS:
                return <PostsView changeState={this.updateStateApp}/>
            case POST:
                return <OnePostView changeState={this.updateStateApp} id={this.state.id}/>
            case ADDPOST:
                return <AddPostView/>
            case LOGIN:
                return <LoginView updateState={this.updateStateApp}/>
            case REGISTER:
                return <RegisterView changeState={this.updateStateApp}/>
            case RESETPW:
                return <ResetPasswordView/>
            case USERINFO:
                return <UserInfoSetupView getUserInfo={this.state}/>
            default:
                return <HomeView/>
        }
    }

    SetView = (obj) => {
        this.setState({CurrentPage: obj.page})
    }

    Logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('loggedIn')
        this.setState({CurrentPage: LOGIN, status: {success: null, msg: ""}, user: null, id: null})
    }

    
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

                                {this.state.loggedIn && localStorage.getItem('token')

                                    ? (<> <Nav.Link
                                        onClick={this.SetView.bind(this, {page: ADDPOST})}
                                        href="#addpost">Add New Post</Nav.Link>
                                        <Nav.Link
                                            onClick={() => this.Logout()}
                                            href="#logout">Logout</Nav.Link>
                                    </>)

                                    : (<> <Nav.Link
                                        onClick={this.SetView.bind(this, {page: REGISTER})}
                                        href="#register">Register</Nav.Link>
                                        <Nav.Link
                                            onClick={this.SetView.bind(this, {page: LOGIN})}
                                            href="#login">Login</Nav.Link>
                                    </>)}


                            </Nav>
                        </Navbar.Collapse>
                    </div>
                </Navbar>

            </div>

            <div id="viewer" className="row container">
                {/*{this.GetView(this.state)}*/}
                <Router>
                    <Routes>
                        <Route path="/" element={this.GetView(this.state)}/>
                        <Route path="/password/reset/:param" element={<PasswordResetRouterView/>}/>
                        <Route path="*" element={<DefaultRoute/>}/>
                    </Routes>
                </Router>
            </div>
        </div>)
    }
}

// used to go back to root page
function DefaultRoute() {
    const navigate = useNavigate();
    React.useEffect(() => {
        navigate('/');
    }, [navigate]);

    return null;
}

export default App
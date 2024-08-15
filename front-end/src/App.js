import React, {Component} from "react"
import {Nav, Navbar} from "react-bootstrap"
import {ABOUT, ADDPOST, HOME, LOGIN, POST, POSTS, PROFILE, REGISTER, RESETPW, USERINFO} from "./Utils/Constants"
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
import ActivateAccountView from "./CustomComponents/ActivateAccountView";

import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom'
import ProfileView from "./CustomComponents/ProfileView";
import axios from "axios";
import {API_URL} from "./Utils/Configuration";
import ActivateEmailView from "./CustomComponents/ActivateEmailView";


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
            postData: {
                title: "",
                body: "",
                editExistingPostData: "add",
                old_post_id: null
            }
        }
        this.updateStateApp = this.updateStateApp.bind(this)
        this.req = axios.create({
            withCredentials: true, baseURL: API_URL, headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    componentDidMount() {
        this.setState({CurrentPage: HOME})
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
                const {id} = this.state;
                return <OnePostView changeState={this.updateStateApp} id={id}/>
            case ADDPOST:
                return <AddPostView changeState={this.updateStateApp} postData={this.state.postData}/>
            case LOGIN:
                return <LoginView updateState={this.updateStateApp}/>
            case REGISTER:
                return <RegisterView changeState={this.updateStateApp}/>
            case RESETPW:
                return <ResetPasswordView/>
            case USERINFO:
                return <UserInfoSetupView getUserInfo={this.state} changeState={this.updateStateApp}/>
            case PROFILE:
                return <ProfileView changeState={this.updateStateApp}/>
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

                <Navbar className="fixed-top navbar navbar-expand-lg navbar-dark" bg="primary" expand="lg">
                    <div className="container-fluid">
                        <Navbar.Brand
                            onClick={this.SetView.bind(this, {page: HOME})}
                            href="">Tech Skill Swap</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link
                                    className={this.state.CurrentPage === HOME ? 'active' : ''}
                                    onClick={this.SetView.bind(this, {page: HOME})}
                                    href="">Home</Nav.Link>
                                <Nav.Link
                                    className={this.state.CurrentPage === ABOUT ? 'active' : ''}
                                    onClick={this.SetView.bind(this, {page: ABOUT})}
                                    href="">About</Nav.Link>
                                <Nav.Link
                                    className={this.state.CurrentPage === POSTS ? 'active' : ''}
                                    onClick={this.SetView.bind(this, {page: POSTS})}
                                    href="">Posts</Nav.Link>

                                {this.state.loggedIn && localStorage.getItem('token') ? (<> <Nav.Link
                                        className={this.state.CurrentPage === ADDPOST ? 'active' : ''}
                                        onClick={this.SetView.bind(this, {page: ADDPOST})}
                                        href="">Add New Post</Nav.Link>
                                        <Nav.Link
                                            className={this.state.CurrentPage === PROFILE ? 'active' : ''}
                                            onClick={this.SetView.bind(this, {
                                                page: PROFILE, user: this.state.user
                                            })}>Profile</Nav.Link>
                                        <Nav.Link
                                            onClick={() => this.Logout()}
                                            href="">Logout</Nav.Link>
                                    </>)

                                    : (<> <Nav.Link
                                        className={this.state.CurrentPage === REGISTER ? 'active' : ''}
                                        onClick={this.SetView.bind(this, {page: REGISTER})}
                                        href="">Register</Nav.Link>
                                        <Nav.Link
                                            className={this.state.CurrentPage === LOGIN ? 'active' : ''}
                                            onClick={this.SetView.bind(this, {page: LOGIN})}
                                            href="">Login</Nav.Link>
                                    </>)}

                            </Nav>
                        </Navbar.Collapse>
                    </div>
                </Navbar>

            </div>

            <div id="viewer" className="row container mt-lg-5 custom-body-padding">
                {/*{this.GetView(this.state)}*/}
                <Router>
                    <Routes>
                        <Route path="/" element={this.GetView(this.state)}/>
                        <Route path="/password-reset/:param"
                               element={<PasswordResetRouterView changeState={this.updateStateApp}/>}/>
                        <Route path="/activate-account/:param"
                               element={<ActivateAccountView changeState={this.updateStateApp}/>}/>
                        <Route path="/activate-email/:param"
                               element={<ActivateEmailView changeState={this.updateStateApp}/>}/>
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
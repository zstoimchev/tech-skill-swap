import React from "react"
import axios from "axios"
import {API_URL} from "../Utils/Configuration"
import {POSTS, RESETPW} from "../Utils/Constants";
import './style.css'

class LoginView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userInput: {
                username: "", password: "", remember_me: false
            }, status: {
                success: null, msg: ""
            }, user: null, loggedIn: false
        }
    }

    // GetTextFromField = (e) => {
    //     this.setState(prevState => ({
    //         user: {...prevState.user, [e.target.name]: e.target.value}
    //     }))
    // }

    GetTextFromField(e) {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.userInput[e.target.name] = e.target.value
        this.setState({userInput: this.state.userInput})
    }


    Login = () => {
        // TODO: validate the data before sending it to the server
        if (this.state.userInput.username === "" || this.state.userInput.password === "") {
            this.setState({status: {success: false, msg: "Missing input filed"}})
            return
        }

        axios.post(API_URL + '/users/login', {
            username: this.state.userInput.username, password: this.state.userInput.password
        }, {
            withCredentials: true
        }).then(response => {
            console.log("Sent to server...")
            if (response.status === 200) {
                this.setState({
                    status: response.data,
                    loggedIn: true,
                    user: this.state.userInput.username,
                    userInput: {password: ""}
                })
                this.props.updateState({user: this.state.userInput.username, loggedIn: true, CurrentPage: POSTS})
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('loggedIn', 'true')
                localStorage.setItem('user', this.state.userInput.username)
            } else {
                console.log("Something is really wrong, DEBUG!")
            }
        }).catch(err => {
            this.setState({status: {success: false, msg: "Username or Password does not match"}})
            console.log(err)

        })
    }

    render() {

        return (<div className="card"
                     style={{
                         width: "400px",
                         marginLeft: "auto",
                         marginRight: "auto",
                         marginTop: "10px",
                         marginBottom: "10px"
                     }}>

            <form style={{margin: "20px"}}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input name="username" onChange={(e) => this.GetTextFromField(e)}
                           type="text"
                           className="form-control"
                           id="email"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input name="password" onChange={(e) => this.GetTextFromField(e)}
                           type="password"
                           className="form-control"
                           id="password"/>
                </div>
                <p className={"form-for-reset-pw"} onClick={() => this.props.updateState({CurrentPage: RESETPW})}>Forgot
                    your password? <span id={"span-form-reset"}>Click here</span></p>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="keep_logged_in"/>
                    <label className="form-check-label" htmlFor="inlineCheckbox1">Keep me logged in</label>
                </div>
            </form>

            <button style={{margin: "10px"}} onClick={() => this.Login()}
                    className="btn btn-primary bt">Log in
            </button>

            {/*// TODO: style these 2 paragraphs and add hyperlink to the related pages*/}
            <p>New around here? Sign up</p>
            <p>Forgot your password?</p>

            {this.state.status.success ?
                <p className="alert alert-success" role="alert">{this.state.status.msg}</p> : null}
            {!this.state.status.success && this.state.status.msg !== "" ?
                <p className="alert alert-danger" role="alert">{this.state.status.msg}</p> : null}

        </div>)
    }
}

export default LoginView
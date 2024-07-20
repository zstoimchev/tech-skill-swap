import React from "react"
import axios from "axios"
import {API_URL} from "../Utils/Configuration"
import {LOGIN, POSTS, REGISTER, RESETPW} from "../Utils/Constants";
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
        this.req = axios.create({
            withCredentials: true, baseURL: API_URL, headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    componentDidMount() {
        /* this.req.get('/users/auth').then(response => {
            if (response.data.success) {
                this.setState({status: response.data})
                localStorage.setItem('user', response.data.user)
                localStorage.setItem('loggedIn', 'true')
                this.props.updateState({user: response.data.username, loggedIn: true, CurrentPage: POSTS})
            }
        }).catch(err => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('loggedIn')
            this.props.updateState({user: null, loggedIn: false, CurrentPage: LOGIN})
        }) */
    }

    GetTextFromField(e) {
        this.state.userInput[e.target.name] = e.target.value
        this.setState({userInput: this.state.userInput})
    }


    Login = () => {
        // TODO: validate the data before sending it to the server
        if (this.state.userInput.username === "" || this.state.userInput.password === "") {
            this.setState({status: {success: false, msg: "Missing input filed"}})
            return
        }

        this.req.post('/users/login', {
            username: this.state.userInput.username, password: this.state.userInput.password
        }).then(response => {
            console.log("Sent to server...")
            if (response.status === 200) {
                this.props.updateState({user: response.data.username, loggedIn: true, CurrentPage: POSTS})
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('loggedIn', 'true')
                localStorage.setItem('user', this.state.userInput.username)
            } else {
                console.log("Something is really wrong, DEBUG!")
            }
            this.setState({
                status: response.data, loggedIn: true, user: this.state.userInput.username, userInput: {password: ""}
            })
        }).catch(err => {
            this.setState({status: err.response.data})
            console.log(err.response.data)
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
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="keep_logged_in"/>
                    <label className="form-check-label" htmlFor="inlineCheckbox1">Keep me logged in</label>
                </div>
            </form>

            <button style={{margin: "10px"}} onClick={() => this.Login()}
                    className="btn btn-primary bt">Log in
            </button>

            <div className={"card-body"}>
                <p className={"form-for-reset-pw"} onClick={() => this.props.updateState({CurrentPage: REGISTER})}>New
                    around here? <b>Sign up</b></p>
                <p className={"form-for-reset-pw"} onClick={() => this.props.updateState({CurrentPage: RESETPW})}>Forgot
                    your password? <b>Click here</b>.</p>
            </div>


            {this.state.status.success ?
                <p className="alert alert-success" role="alert">{this.state.status.msg}</p> : null}
            {!this.state.status.success && this.state.status.msg !== "" ?
                <p className="alert alert-danger" role="alert">{this.state.status.msg}</p> : null}

        </div>)
    }
}

export default LoginView
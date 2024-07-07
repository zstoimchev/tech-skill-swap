import React from "react";
import axios from "axios";
import {API_URL} from "../Utils/Configuration";

class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_input: {
                username: "", password: "", remember_me: false
            }, user: null, status: {
                success: null, msg: ""
            }
        }
    }

    QGetTextFromField(e) {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.user_input[e.target.name] = e.target.value;
        this.setState({user_input: this.state.user_input});
    }


    PostLogin = () => {
        console.log(this.state)
        // TODO: you should validate the data before sending it to the server,
        if (this.state.user_input.username === "" || this.state.user_input.password === "") {
            //this.state.status= {success:false, msg:"Missing input filed"}
            // eslint-disable-next-line react/no-direct-mutation-state
            this.setState(this.state.status = {success: false, msg: "Missing input filed"})
            return
        }

        axios.post(API_URL + '/users/login', {
            username: this.state.user_input.username, password: this.state.user_input.password
        })
            .then(response => {
                console.log("Sent to server...")
                console.log(this.state.user_input)
                console.log(response.status)
                if (response.status === 200) {
                    console.log(response.data)
                    // eslint-disable-next-line react/no-direct-mutation-state
                    this.setState(this.state.status = response.data.status)
                    // eslint-disable-next-line react/no-direct-mutation-state
                    this.setState(this.state.user = response.data.user)
                    this.props.onLogin(response.data.user);

                } else {
                    console.log("Something is really wrong, DEBUG!")
                }

            })
            .catch(err => {
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
                    <input name="username" onChange={(e) => this.QGetTextFromField(e)}
                           type="text"
                           className="form-control"
                           id="exampleInputEmail1"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input name="password" onChange={(e) => this.QGetTextFromField(e)}
                           type="password"
                           className="form-control"
                           id="exampleInputPassword1"/>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="keep_logged_in"/>
                    <label className="form-check-label" htmlFor="inlineCheckbox1">Keep me logged in</label>
                </div>
            </form>

            <button style={{margin: "10px"}} onClick={() => this.PostLogin()}
                    className="btn btn-primary bt">Log in
            </button>

            {this.state.status.success ?
                <p className="alert alert-success" role="alert">{this.state.status.msg}</p> : null}
            {!this.state.status.success && this.state.status.msg !== "" ?
                <p className="alert alert-danger" role="alert">{this.state.status.msg}</p> : null}

        </div>)
    }
}

export default LoginView
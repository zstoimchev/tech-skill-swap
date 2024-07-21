import React, {Component} from "react";
import axios from 'axios'
import {API_URL} from "../Utils/Configuration";
import {LOGIN, REGISTER, RESETPW, USERINFO} from "../Utils/Constants";


class RegisterView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: {
                success: null, msg: ""
            }, user: {
                name: "", surname: "", email: "", username: "", password: "", password2: "", role: "",
            }
        }
    }

    SetValueFromUserInput = (e) => {
        this.setState(prevState => ({
            user: {...prevState.user, [e.target.id]: e.target.value}
        }))
    }

    Register = () => {
        // TODO: validate all the data before sending it to the server,
        axios.post(API_URL + '/users/register', // TODO: include header to check if there is already logged in user
            {
                name: this.state.user.name,
                surname: this.state.user.surname,
                username: this.state.user.username,
                email: this.state.user.email,
                password: this.state.user.password,
                password2: this.state.user.password2,
                role: this.state.user.role,
            })
            .then(response => {
                this.setState({status: response.data})
                // TODO: implement encryption for the password and handle bad responses
                console.log("Sent to server...")
                this.props.changeState({user: this.state.user.email, role: this.state.user.role})
            })
            .catch(err => {
                this.setState({status: err.response.data})
                console.log(err.response.data)
                console.log(err.response.status)
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

                <div className="row mb-3">
                    <div className="col">
                        {/*<input type="text" className="form-control" placeholder="First name"/>*/}
                        <label htmlFor="name">First name</label>
                        <input onChange={this.SetValueFromUserInput} type="text" className="form-control" id="name"
                               placeholder="Name"/>
                    </div>

                    <div className="col">
                        {/*<input type="text" className="form-control" placeholder="Last name"/>*/}
                        <label htmlFor="surname">Last name</label>
                        <input onChange={this.SetValueFromUserInput} type="text" className="form-control" id="surname"
                               placeholder="Surname"/>
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="email">E-mail</label>
                    <input onChange={this.SetValueFromUserInput} type="email" className="form-control" id="email"
                           placeholder="username [at] provider [dot] domain"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="username">Username</label>
                    <input onChange={this.SetValueFromUserInput} type="text" className="form-control" id="username"
                           placeholder="@username"/>
                </div>


                <div className="mb-3">
                    <label htmlFor="dropdown">What is your role?</label>
                    <select onChange={this.SetValueFromUserInput} className="form-control" id="role">
                        <option value="">Select an option</option>
                        <option value="Helper">I want to help people</option>
                        <option value="Seeker">I want to ask for help</option>
                        <option value="both">I want to do both</option>
                    </select>
                </div>


                <div className="mb-3">
                    <label htmlFor="password">Password</label>
                    <input onChange={this.SetValueFromUserInput} type="password" className="form-control" id="password"
                           placeholder="********"/>
                </div>

                <div className="form-group">
                    <label htmlFor="password2">Repeat password</label>
                    <input onChange={this.SetValueFromUserInput} type="password" className="form-control" id="password2"
                           placeholder="********"/>
                </div>
                <br/>
                <div style={{fontSize: "0.8rem", color: "gray", marginTop: "5px"}}>
                    * First/Last name Rules: Minimum 4 characters, no special symbols, numbers are allowed.
                </div>
                <div style={{fontSize: "0.8rem", color: "gray", marginTop: "5px"}}>
                    ** Username Rules: Minimum 4 characters, no special symbols except [. - _ '], can contain numbers
                </div>
                <div style={{fontSize: "0.8rem", color: "gray", marginTop: "5px"}}>
                    *** Password Rules: Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.
                </div>


            </form>

            {this.state.status.success ? (<>
                <button style={{margin: "10px"}}
                        onClick={() => this.props.changeState({CurrentPage: USERINFO})}
                        className="btn btn-primary bt">Complete your profile
                </button>
            </>) : <button style={{margin: "10px"}}
                           onClick={() => this.Register()}
                           className="btn btn-primary bt">Submit
            </button>}

            <div className={"card-body"}>
                <p className={"form-for-reset-pw"}
                   onClick={() => this.props.changeState({CurrentPage: LOGIN})}>Already have an account? <b>Log
                    in</b></p>
            </div>


            {this.state.status.success ? (<><p className="alert alert-success" role="alert">{this.state.status.msg}</p>
                <p>Click on the link above to complete your profile.</p>
            </>) : null}

            {!this.state.status.success && this.state.status.msg !== "" ?
                <p className="alert alert-danger" role="alert">{this.state.status.msg}</p> : null}

        </div>)
    }
}

export default RegisterView

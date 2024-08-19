import React, {Component} from "react";
import axios from 'axios'
import {API_URL} from "../Utils/Configuration";
import {LOGIN, REGISTER, RESETPW, USERINFO} from "../Utils/Constants";
import {OverlayTrigger, Tooltip} from "react-bootstrap";


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
                               placeholder="Name" autoComplete="given-name"/>
                    </div>

                    <div className="col">
                        {/*<input type="text" className="form-control" placeholder="Last name"/>*/}
                        <label htmlFor="surname">Last name</label>
                        <input onChange={this.SetValueFromUserInput} type="text" className="form-control" id="surname"
                               placeholder="Surname" autoComplete="family-name"/>
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="email">E-mail</label>
                    <input onChange={this.SetValueFromUserInput} type="email" className="form-control" id="email"
                           placeholder="username [at] provider [dot] domain" autoComplete="email"/>
                </div>

                <div className="mb-3">
                    <div className={"d-flex align-items-center justify-content-between"}>
                        <label htmlFor="username">Username</label>
                        <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip id="password-tooltip">
                                Username Rules: Minimum 4 characters, no special symbols, except ' NaN ', can contain
                                numbers.
                            </Tooltip>}
                        >
                            <button type="button" className="btn btn-info btn-sm" id="username-role"
                                    style={{marginLeft: "5px", borderRadius: "40%"}}>
                                i
                            </button>
                        </OverlayTrigger>
                    </div>
                    <input onChange={this.SetValueFromUserInput} type="text" className="form-control" id="username"
                           placeholder="@username" autoComplete="username"/>
                </div>


                <div className="mb-3">
                    <label htmlFor="role">What is your role?</label>
                    <select onChange={this.SetValueFromUserInput} className="form-control" id="role" autoComplete="off">
                        <option value="">Select an option</option>
                        <option value="Helper">I want to help people</option>
                        <option value="Seeker">I want to ask for help</option>
                        <option value="both">I want to do both</option>
                    </select>
                </div>


                <div className="mb-3">
                    <div className={"d-flex align-items-center justify-content-between"}>
                        <label htmlFor="password">Password</label>
                        <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip id="password-tooltip">
                                Password Rules: Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special
                                character.
                            </Tooltip>}
                        >
                            <button type="button" className="btn btn-info btn-sm"
                                    style={{marginLeft: "5px", borderRadius: "40%"}}>
                                i
                            </button>
                        </OverlayTrigger>
                    </div>
                    <input onChange={this.SetValueFromUserInput} type="password" className="form-control" id="password"
                           placeholder="********" autoComplete="off"/>
                </div>

                <div className="form-group">
                    <label htmlFor="password2">Repeat password</label>
                    <input onChange={this.SetValueFromUserInput} type="password" className="form-control" id="password2"
                           placeholder="********" autoComplete="off"/>
                </div>


            </form>

            {this.state.status.success ? (<>
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
                <p>Check your email for further instructions on how to complete your account.</p>
            </>) : null}

            {!this.state.status.success && this.state.status.msg !== "" ?
                <p className="alert alert-danger" role="alert">{this.state.status.msg}</p> : null}

        </div>)
    }
}

export default RegisterView

import React, {Component} from "react";
import axios from 'axios'
import {API_URL} from "../Utils/Configuration";
import {USERINFO} from "../Utils/Constants";


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
                        <label htmlFor="name">First Name</label>
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
                           placeholder="E-mail"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="username">Username</label>
                    <input onChange={this.SetValueFromUserInput} type="text" className="form-control" id="username"
                           placeholder="Username"/>
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
                           placeholder="Password"/>
                </div>

                <div className="form-group">
                    <label htmlFor="password2">Repeat password</label>
                    <input onChange={this.SetValueFromUserInput} type="password" className="form-control" id="password2"
                           placeholder="Repeat password"/>
                </div>


            </form>
            <button style={{margin: "10px"}}
                    onClick={() => this.Register()}
                    className="btn btn-primary bt">Submit
            </button>

            {this.state.status.success ?
                (<><p className="alert alert-success" role="alert">{this.state.status.msg}</p>
                </>) : null}
            {!this.state.status.success && this.state.status.msg !== "" ?
                <p className="alert alert-danger" role="alert">{this.state.status.msg}</p> : null}
            <p onClick={() => this.props.changeState({CurrentPage: USERINFO})}>Click here to complete your
                profile</p>
        </div>)
    }
}

export default RegisterView

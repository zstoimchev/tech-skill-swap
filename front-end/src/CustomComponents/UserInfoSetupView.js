import React, {Component} from "react";
import axios from 'axios'
import {API_URL} from "../Utils/Configuration";
import {LOGIN} from "../Utils/Constants";


class UserInfoSetupView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: {
                success: null, msg: ""
            }, user: {
                interests: "", skills: "", about: "", role: "", email: ""
            }
        }
    }

    componentDidMount() {
        this.setState({user: {role: this.props.getUserInfo.role, email: this.props.getUserInfo.user}})
    }


    SetValueFromUserInput = (e) => {
        this.setState(prevState => ({
            user: {...prevState.user, [e.target.id]: e.target.value}
        }))
    }

    Submit = () => {
        console.log("---")
        axios.post(API_URL + '/profile/complete-profile', {
            role: this.state.user.role,
            email: this.state.user.email,
            skills: this.state.user.skills,
            interests: this.state.user.interests,
            about: this.state.user.about,
        })
            .then(response => {
                console.log("received sth form server")
                this.setState({status: response.data})
            })
            .catch(error => {
                console.log(error.response.data)
                this.setState({status: error.response.data})
            })
    }


    render() {
        return (<div className="card"
                     style={{
                         width: "450px",
                         marginLeft: "auto",
                         marginRight: "auto",
                         marginTop: "10px",
                         marginBottom: "10px"
                     }}>
            <form className="m-3">
                <h5 className="card-title mb-4 text-center">Tell us something more about yourself</h5>
                <div className="mb-3">
                    <div className="mb-3 m-3">
                        <label htmlFor="about">About</label>

                        <textarea name="about"
                                  id="about"
                                  className="form-control"
                                  rows="3"
                                  onChange={this.SetValueFromUserInput}
                                  placeholder="Briefly tell something about yourself..."/>
                    </div>
                </div>

                {this.state.user.role === "Seeker" || this.state.user.role === "both" ? <div className="mb-3">
                    <div className="mb-3 m-3">
                        <label htmlFor="interests">Interests</label>
                        <textarea name="interests"
                                  id="interests"
                                  className="form-control"
                                  rows="2"
                                  onChange={this.SetValueFromUserInput}
                                  placeholder="List what you are interested in..."/>
                    </div>
                </div> : null}

                {this.state.user.role === "Helper" || this.state.user.role === "both" ? <div className="mb-3">
                    <div className="mb-3 m-3">
                        <label htmlFor="skills">Skills</label>
                        <textarea name="skills"
                                  id="skills"
                                  className="form-control"
                                  rows="2"
                                  onChange={this.SetValueFromUserInput}
                                  placeholder="List the skills you can offer..."/>
                    </div>
                </div> : null}

            </form>

            {!this.state.status.success ? <button style={{margin: "10px"}}
                                                  onClick={() => this.Submit()}
                                                  className="btn btn-primary bt">Submit
            </button> : <button style={{margin: "10px"}}
                                onClick={() => this.props.changeState({CurrentPage: LOGIN})}
                                className="btn btn-primary bt">Go to Login</button>}


            {this.state.status.success ?
                <p className="alert alert-success" role="alert">{this.state.status.msg}</p> : null}
            {!this.state.status.success && this.state.status.msg !== "" ?
                <p className="alert alert-danger" role="alert">{this.state.status.msg}</p> : null}

        </div>)
    }
}

export default UserInfoSetupView

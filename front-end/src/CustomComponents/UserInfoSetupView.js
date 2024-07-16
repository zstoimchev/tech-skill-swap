import React, {Component} from "react";
import axios from 'axios'
import {API_URL} from "../Utils/Configuration";


class UserInfoSetupView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: {
                success: null, msg: ""
            }, user: {
                interests: "", skills: "", about: "", role: "Seeker", email: ""
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

    Submit() {
        axios.post(API_URL + '/users/complete-profile', {
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
            <h5 className="card-title">Tell us something more about yourself</h5>
            <form style={{margin: "20px"}}>

                {this.state.role === "Seeker" ? <div className="mb-3">
                    <label htmlFor="interests">Interests</label>
                    <input onChange={this.SetValueFromUserInput} type="text" className="form-control" id="interests"
                           placeholder="List what you are interested in..."/>
                </div> : <div className="mb-3">
                    <label htmlFor="skills">Skills</label>
                    <input onChange={this.SetValueFromUserInput} type="text" className="form-control" id="skills"
                           placeholder="List skills you can offer..."/>
                </div>}

                {this.state.role === "both" ? <div className="mb-3">
                    <label htmlFor="interests">Interests</label>
                    <input onChange={this.SetValueFromUserInput} type="text" className="form-control" id="interests"
                           placeholder="List what you are interested in..."/>
                </div> : null}

                <div className="mb-3">
                    <label htmlFor="about">About</label>
                    <input onChange={this.SetValueFromUserInput} type="text" className="form-control" id="about"
                           placeholder="Briefly tell something about yourself..."/>
                </div>

            </form>

            <button style={{margin: "10px"}}
                    onClick={() => this.Submit()}
                    className="btn btn-primary bt">Submit
            </button>

            {this.state.status.success ?
                <p className="alert alert-success" role="alert">{this.state.status.msg}</p> : null}
            {!this.state.status.success && this.state.status.msg !== "" ?
                <p className="alert alert-danger" role="alert">{this.state.status.msg}</p> : null}

        </div>)
    }
}

export default UserInfoSetupView

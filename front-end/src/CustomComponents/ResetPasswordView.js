import React from "react"
import axios from "axios"
import {API_URL} from "../Utils/Configuration"
import './style.css'

class ResetPasswordView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userInput: {
                email: "",
            }, status: {
                success: null, msg: ""
            },
        }
    }

    GetTextFromField(e) {
        this.setState(prevState => ({
            userInput: {
                ...prevState.userInput, [e.target.name]: e.target.value
            }
        }));
    }

    Reset = (e) => {
        e.preventDefault()
        axios.post(API_URL + '/password/reset', {
            email: this.state.userInput.email
        }, {
            withCredentials: true
        }).then(response => {
            console.log("Sent to server...")
            this.setState({status: response.data})
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
            <div className="card-body">
                <h5 className="card-title">Reset Password</h5>
                <form onSubmit={(e) => this.Reset(e)}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input name="email" onChange={(e) => this.GetTextFromField(e)} type="email"
                               className="form-control"
                               id="email" aria-describedby="emailHelp"/>
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
            {this.state.status.success ? (<> <p className="alert alert-success" role="alert">{this.state.status.msg}</p>
                <p>You can now close this window. You will receive all instructions via email, at <span
                    id={"font-weight-paragraph"}>{this.state.userInput.email}</span></p> </>) : null}
            {!this.state.status.success && this.state.status.msg !== "" ?
                <p className="alert alert-danger" role="alert">{this.state.status.msg}</p> : null}

        </div>)
    }
}

export default ResetPasswordView
import React from "react"
import {useNavigate, useParams} from 'react-router-dom'
import axios from "axios"
import {API_URL} from "../Utils/Configuration"


class PasswordResetRouterView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userInput: {
                password: "", password2: "",
            }, status: {
                success: null, msg: ""
            }, user: null, loggedIn: false, param: props.param
        }
        this.GetTextFromField = this.GetTextFromField.bind(this);

    }

    GetTextFromField(e) {
        this.setState(prevState => ({
            userInput: {
                ...prevState.userInput, [e.target.name]: e.target.value
            }
        }));
    }

    componentDidMount() {
        const {param} = this.props
        const cleanedParam = param.substring(1);

        axios.get(API_URL + '/password/reset/' + cleanedParam)
            .then(response => {
                console.log("succeeded")
            })
            .catch(error => {
                console.log("not so much")
                console.log(error.response.data)
                this.props.navigate('/')
            });
    }

    Submit = () => {
        const {param} = this.props
        const cleanedParam = param.substring(1);

        axios.post(API_URL + '/password/reset/' + cleanedParam, {
            pw1: this.state.userInput.password, pw2: this.state.userInput.password2,
        })
            .then(response => {
                this.setState({status: response.data})
                console.log("succeeded")
            })
            .catch(error => {
                this.setState({status: error.response.data})
                console.log("not so much")
                console.log(error.response.data)
                // this.props.navigate('/')
            });
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
                    <label className="form-label">Password</label>
                    <input name="password" onChange={(e) => this.GetTextFromField(e)}
                           type="password"
                           className="form-control"
                           id="password"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Repeat password</label>
                    <input name="password2" onChange={(e) => this.GetTextFromField(e)}
                           type="password"
                           className="form-control"
                           id="exampleInputPassword1"/>
                </div>
            </form>

            <button style={{margin: "10px"}} onClick={this.Submit}
                    className="btn btn-primary bt">Submit
            </button>

            {this.state.status.success ?
                <p className="alert alert-success" role="alert">{this.state.status.msg}</p> : null}
            {!this.state.status.success && this.state.status.msg !== "" ?
                <p className="alert alert-danger" role="alert">{this.state.status.msg}</p> : null}

        </div>)
    }
}

// used to go back to root page
function PasswordResetRouterViewWithNavigation(props) {
    const navigate = useNavigate()
    const {param} = useParams()
    return <PasswordResetRouterView {...props} navigate={navigate} param={param}/>
}

export default PasswordResetRouterViewWithNavigation;

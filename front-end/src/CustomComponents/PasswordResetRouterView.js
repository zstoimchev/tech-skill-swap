import React from "react"
import {useNavigate, useParams} from 'react-router-dom'
import axios from "axios"
import {API_URL} from "../Utils/Configuration"
import {LOGIN} from "../Utils/Constants";
import {OverlayTrigger, Tooltip} from "react-bootstrap";


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
        const param = this.props.param

        axios.get(API_URL + '/password/reset/' + param)
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
                    {/*<label className="form-label">Password</label>*/}
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

            {this.state.status.success ? <button style={{margin: "10px"}} onClick={() => {
                this.props.navigate('/');
                this.props.changeState({CurrentPage: LOGIN});
            }}
                                                 className="btn btn-primary bt">Go back to Login
            </button> : <button style={{margin: "10px"}} onClick={this.Submit}
                                className="btn btn-primary bt">Submit
            </button>}

            {/*{this.state.status.success ?*/}
            {/*    <p className="alert alert-success" role="alert">{this.state.status.msg}</p> : null}*/}
            {this.state.status.success ? (<> <p className="alert alert-success" role="alert">{this.state.status.msg}</p>
                <p>Your password was changed successfully! You can now close this window, or
                    <span id={"font-weight-paragraph"}
                          onClick={() => {
                              this.props.navigate('/');
                              this.props.changeState({CurrentPage: LOGIN});
                          }}> click here to go back to login</span>.
                </p> </>) : null}

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

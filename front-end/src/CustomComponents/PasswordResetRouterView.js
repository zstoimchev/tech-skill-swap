import React from "react"
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import { API_URL } from "../Utils/Configuration"


class PasswordResetRouterView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userInput: {
                username: "", password: "", remember_me: false
            },
            status: {
                success: null, msg: ""
            },
            user: null,
            loggedIn: false,
            param: props.param
        }
    }

    componentDidMount() {
        const { param } = this.props;
        console.log("Param from URL:", param);
        console.log(this.state)

        // axios.get(API_URL + '/password/reset/:token')
        //     .then(response => {
        //         if (Array.isArray(response.data.arr)) {
        //             this.setState({
        //                 Posts: response.data.arr
        //             });
        //         } else {
        //             console.error(response.data.msg);
        //         }
        //     })
        //     .catch(error => {
        //
        //         console.log(error)
        //     });
    }

    Submit = () => {
        // Navigate using the navigate prop
        this.props.navigate('/');
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
                           type="text"
                           className="form-control"
                           id="password"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Repeat password</label>
                    <input name="password2" onChange={(e) => this.GetTextFromField(e)}
                           type="password2"
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
    const { param } = useParams()
    return <PasswordResetRouterView {...props} navigate={navigate} param={param}/>
}

export default PasswordResetRouterViewWithNavigation;

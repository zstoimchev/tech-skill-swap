import React, {Component} from "react";
import axios from 'axios'
import {API_URL} from "../Utils/Configuration";
import {REGISTER} from "../Utils/Constants";
import {useNavigate, useParams} from 'react-router-dom'


class ActivateAccountView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: {
                success: null, msg: ""
            }
        }
            this.activateAccount = this.activateAccount.bind(this);
    }

    componentDidMount() {
        this.activateAccount()
    }

    activateAccount = () => {
        const param = this.props.param;
        axios.post(API_URL + `/users/activate-account/` + param)
            .then(response => {
                console.log(response.data);
                this.setState({ status: response.data });
            })
            .catch(error => {
                console.error(error.response.data);
                this.setState({ status: error.response.data });
            });
    }

    render() {
        return (<div className="card mt-3"
                     style={{
                         width: "450px",
                         marginLeft: "auto",
                         marginRight: "auto",
                         marginTop: "10px",
                         marginBottom: "10px"
                     }}>
            <form className="m-3">
                <h5 className="card-title text-center">Status of account verification</h5>
                <p className="card-body text-center">Click on the link bellow to complete your profile, or go back to
                    registration to submit your request again.</p>
            </form>

            {this.state.status.success ? <button style={{margin: "10px"}}
                                                 onClick={() => this.Submit()}
                                                 className="btn btn-primary bt">Complete your profile
            </button> : <button style={{margin: "10px"}}
                                onClick={() => {
                                    this.props.navigate('/');
                                    this.props.changeState({CurrentPage: REGISTER});
                                }}
                                className="btn btn-primary bt">Go back to Registration</button>}


            {this.state.status.success ?
                <p className="alert alert-success" role="alert">{this.state.status.msg}</p> : null}
            {!this.state.status.success && this.state.status.msg !== "" ?
                <p className="alert alert-danger" role="alert">{this.state.status.msg}</p> : null}

        </div>)
    }
}

// used to go back to root page
function ActivateAccountViewWithNavigation(props) {
    const navigate = useNavigate()
    const {param} = useParams()
    return <ActivateAccountView {...props} navigate={navigate} param={param}/>
}

export default ActivateAccountViewWithNavigation

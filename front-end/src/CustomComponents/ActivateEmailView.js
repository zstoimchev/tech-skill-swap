import React, {Component} from "react";
import axios from 'axios'
import {API_URL} from "../Utils/Configuration";
import {HOME} from "../Utils/Constants";
import {useNavigate, useParams} from 'react-router-dom'


class ActivateEmailView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: {
                success: null, msg: ""
            }
        }
        this.activateEmail = this.activateEmail.bind(this);
    }

    componentDidMount() {
        this.activateEmail()
    }

    activateEmail = () => {
        const param = this.props.param
        axios.post(API_URL + `/profile/activate-email/` + param)
            .then(response => {
                this.setState({status: response.data})
            })
            .catch(error => {
                console.error(error.response.data);
                this.setState({status: error.response.data});
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
                <h5 className="card-title text-center">Status of email verification</h5>
                {/*<p className="card-body text-center">Click on the link bellow to complete your profile, or go back to*/}
                {/*    registration to submit your request again.</p>*/}
            </form>

            <button style={{margin: "10px"}}
                    onClick={() => {
                        this.props.navigate('/');
                        this.props.changeState({CurrentPage: HOME})
                    }}
                    className="btn btn-primary bt">Return to Home
            </button>


            {this.state.status.success ?
                <p className="alert alert-success" role="alert">{this.state.status.msg}</p> : null}
            {!this.state.status.success && this.state.status.msg !== "" ?
                <p className="alert alert-danger" role="alert">{this.state.status.msg}</p> : null}

        </div>)
    }
}

// used to go back to root page
function ActivateEmailViewWithNavigation(props) {
    const navigate = useNavigate()
    const {param} = useParams()
    return <ActivateEmailView {...props} navigate={navigate} param={param}/>
}

export default ActivateEmailViewWithNavigation

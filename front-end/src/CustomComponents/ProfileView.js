import React from "react";
import axios from "axios";
import {API_URL} from "../Utils/Configuration";
import {POST} from "../Utils/Constants";

class ProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Posts: [],
            User: null,
            username: localStorage.getItem("user"),
            editName: false,
            editEmail: false,
            editUsername: false,
            editPassword: false,
            userInput: {
                name: "",
                surname: "",
                email: "",
                username: "",
                role: "",
                oldpassword: "",
                newpassword: "",
                newpassword2: "",
            },
            status: {
                success: null, msg: ""
            },
        }
    }

    SetValueFromUserInput = (event) => {
        this.setState(prevState => ({
            userInput: {
                ...prevState.userInput, [event.target.id]: event.target.value
            }
        }))
    }

    editNameSurname() {
        this.setState({editName: true, userInput: {name: this.state.User.name, surname: this.state.User.surname}})

    }


    componentDidMount() {
        this.getUserData()
    }

    getUserData() {
        axios.get(API_URL + '/profile/' + this.state.username)
            .then(response => {
                this.setState({Posts: response.data.postData, User: response.data.userData})
            })
            .catch(error => {
                console.error("caught error")
                console.log(error)
            })
    }

    submitName = () => {
        this.setState(prevState => ({
            ...prevState, editName: false, userInput: {
                ...prevState.userInput, name: "", surname: ""
            }
        }))
        axios.post(API_URL + '/profile/change-name-surname', {
            name: this.state.userInput.name, surname: this.state.userInput.surname, user: localStorage.getItem("user"),
        })
            .then(response => {
                this.setState({status: response.data})
                this.getUserData()
            })
            .catch(error => {
                this.setState({status: error.response.data})
                console.log(error.response.data)
            })
    }

    submitEmail = () => {
        this.setState(prevState => ({
            ...prevState, editEmail: false, userInput: {
                ...prevState.userInput, email: ""
            }
        }))
        axios.post(API_URL + '/profile/change-email', {
            email: this.state.userInput.email, user: localStorage.getItem("user"),
        })
            .then(response => {
                this.setState({status: response.data})
                this.getUserData()
            })
            .catch(error => {
                this.setState({status: error.response.data})
                console.log(error.response.data)
            })
    }

    submitUsername() {

    }

    submitPassword() {

    }


    render() {
        const p = this.state.Posts
        if (this.state.User === null) {
            return <div>No user logged in! Please log in first.</div>
        }

        return (<div className="card" style={{margin: "10px"}}>
            <div className="card-body">

                {/*CHANGE NAME/SURNAME*/}
                <div className={"d-flex align-items-center"}>
                    {!this.state.editName ? (<>
                        <h1 className="card-title"><b>{this.state.User.name} {this.state.User.surname}</b></h1>
                        <button onClick={() => this.setState(prevState => ({
                            ...prevState, editName: true, userInput: {
                                ...prevState.userInput, name: prevState.User.name, surname: prevState.User.surname
                            }
                        }))}
                                className={"btn btn-primary btn-md ms-auto"}>Edit
                            Name/Surname
                        </button>
                    </>) : (<>
                        <div className="row mb-3">
                            <div className="col">
                                <input onChange={this.SetValueFromUserInput}
                                       type="text"
                                       className="form-control"
                                       id="name"
                                       defaultValue={this.state.User.name}/>
                            </div>

                            <div className="col">
                                <input onChange={this.SetValueFromUserInput}
                                       type="text"
                                       className="form-control"
                                       id="surname"
                                       defaultValue={this.state.User.surname}/>
                            </div>
                        </div>
                        <div className="ms-auto">
                            <button onClick={this.submitName}
                                    className={"btn btn-success btn-md me-1"}>Submit
                            </button>
                            <button onClick={() => this.setState({editName: false})}
                                    className={"btn btn-danger btn-md ms-auto"}>Cancel
                            </button>
                        </div>
                    </>)}
                </div>
                <hr/>

                {/*CHANGE EMAIL*/}
                <div className={"d-flex align-items-center"}>
                    {!this.state.editEmail ? (<> <h5 className="card-title">E-mail: <b>{this.state.User.email}</b></h5>
                        <button onClick={() => this.setState(prevState => ({
                            ...prevState, editEmail: true, userInput: {
                                ...prevState.userInput, email: prevState.User.email
                            }
                        }))}
                                className={"btn btn-primary btn-sm ms-auto"}>Update E-mail
                        </button>
                    </>) : (<>
                        <div className="row mb-0">
                            <input onChange={this.SetValueFromUserInput}
                                   type="text"
                                   className="form-control"
                                   id="email"
                                   defaultValue={this.state.User.email}/>
                        </div>
                        <div className="ms-auto">
                            <button onClick={this.submitEmail}
                                    className={"btn btn-success btn-sm me-1"}>Submit
                            </button>
                            <button onClick={() => this.setState({editEmail: false})}
                                    className={"btn btn-danger btn-sm ms-auto"}>Cancel
                            </button>
                        </div>
                    </>)}
                </div>

                {/*CHANGE USERNAME*/}
                <div className={"d-flex align-items-center"}>
                    {!this.state.editUsername ? (<>
                        <h5 className="card-title">Username: <b>{this.state.User.username}</b></h5>
                        <button onClick={() => this.setState(prevState => ({
                            ...prevState, editUsername: true, userInput: {
                                ...prevState.userInput, username: prevState.User.username
                            }
                        }))}
                                className={"btn btn-primary btn-sm ms-auto"}>Edit username
                        </button>
                    </>) : (<>
                        <div className="row mb-0">
                            <div className="col">
                                <input onChange={this.SetValueFromUserInput}
                                       type="text"
                                       className="form-control"
                                       id="username"
                                       defaultValue={this.state.User.username}/>
                            </div>
                        </div>
                        <div className="ms-auto">
                            <button onClick={this.submitUsername}
                                    className={"btn btn-success btn-sm me-1"}>Submit
                            </button>
                            <button onClick={() => this.setState({editUsername: false})}
                                    className={"btn btn-danger btn-sm ms-auto"}>Cancel
                            </button>
                        </div>
                    </>)}
                </div>

                {/*CHANGE PASSWORD*/}
                <div className={"d-flex align-items-center"}>
                    {!this.state.editPassword ? (<>
                        {/*<div className="row mb-3">*/}
                        <h5>Feel like you have weak password? Click here and change it.</h5>
                        <div className="ms-auto">
                            <button onClick={() => this.setState({editPassword: true})}
                                    className={"btn btn-primary btn-sm me-1"}>Change password
                            </button>
                        </div>

                    </>) : (<>
                        <div className="row mb-3">
                            <div className="col">
                                <label htmlFor="name">Old password</label>
                                <input onChange={this.SetValueFromUserInput} type="password"
                                       className="form-control"
                                       id="oldpassword"
                                       placeholder=""/>
                            </div>
                            <div className="col">
                                <label htmlFor="surname">New password</label>
                                <input onChange={this.SetValueFromUserInput} type="password"
                                       className="form-control"
                                       id="newpassword"
                                       placeholder=""/>
                            </div>
                            <div className="col">
                                <label htmlFor="surname">Repeat new passvord</label>
                                <input onChange={this.SetValueFromUserInput} type="password"
                                       className="form-control"
                                       id="newpassword2"
                                       placeholder=""/>
                            </div>
                        </div>
                        <div className="ms-auto">
                            <button onClick={this.submitPassword}
                                    className={"btn btn-success btn-sm me-1"}>Submit
                            </button>
                            <button onClick={() => this.setState({editPassword: false})}
                                    className={"btn btn-danger btn-sm ms-auto"}>Cancel
                            </button>
                        </div>
                    </>)}
                </div>

                {this.state.status.success ? (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {this.state.status.msg}
                        <button onClick={() => this.setState({status: {success: null, msg: ""}})}
                                type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                ) : null}

                {!this.state.status.success && this.state.status.msg !== "" ? (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {this.state.status.msg}
                        <button onClick={() => this.setState({status: {success: null, msg: ""}})}
                                type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                ) : null}


                <hr/>

                {/*ALL POSTS AUTHORED*/}
                <div className="row row-cols-1 g-4" style={{margin: "10px"}}>
                    <h4 className={"card-title"} style={{fontWeight: "bold"}}>All posts asking/requesting for
                        help:</h4>    {p.length > 0 ? p.map((d) => {
                    return (<div className="col" key={d.id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{d.title}</h5>
                                <p className="card-text">{d.body}</p>
                            </div>
                            <button onClick={() => this.props.changeState({CurrentPage: POST, id: d.id})}
                                    style={{margin: "10px"}} className="btn btn-primary bt">Read more
                            </button>
                        </div>

                    </div>)
                }) : "No help requested yet"}
                </div>


            </div>
        </div>)
    }

}

export default ProfileView
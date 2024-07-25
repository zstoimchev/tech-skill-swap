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
            userInput: {
                name: "", surname: "", email: "", username: "", role: "", password: "", password2: "",
            },
        }
    }

    SetValueFromUserInput = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    componentDidMount() {
        axios.get(API_URL + '/profile/' + this.state.username)
            .then(response => {
                this.setState({Posts: response.data.postData, User: response.data.userData});
            })
            .catch(error => {
                console.error("caught error")
                console.log(error)
            })
    }

    editNameSurname = () => {
        // TODO: call the API and save the new name and surname
        this.setState({editName: !this.state.editName});
    }

    render() {
        const p = this.state.Posts
        if (this.state.User === null) {
            return <div>Loading...</div>
        }

        return (<div className="card" style={{margin: "10px"}}>
            <div className="card-body">

                {/*CHANGE NAME/SURNAME*/}
                <div className={"d-flex align-items-center"}>
                    {!this.state.editName ? (<>
                        <h1 className="card-title"><b>{this.state.User.name} {this.state.User.surname}</b></h1>
                        <button onClick={() => this.setState({editName: !this.state.editName})}
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
                            <button onClick={this.editNameSurname}
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
                        <button onClick={() => this.setState({editEmail: !this.state.editEmail})}
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
                            <button onClick={this.editEmail}
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
                        <button onClick={() => this.setState({editUsername: !this.state.editUsername})}
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
                            <button onClick={this.editUsername}
                                    className={"btn btn-success btn-sm me-1"}>Submit
                            </button>
                            <button onClick={() => this.setState({editUsername: false})}
                                    className={"btn btn-danger btn-sm ms-auto"}>Cancel
                            </button>
                        </div>
                    </>)}
                </div>

                {/*CHANGE PASSWORD*/}
                <h5>Change your password, click here</h5>
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
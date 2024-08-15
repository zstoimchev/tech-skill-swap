import React from "react";
import axios from "axios";
import {API_URL} from "../Utils/Configuration";
import {ADDPOST, LOGIN, POST} from "../Utils/Constants";
import 'bootstrap-icons/font/bootstrap-icons.css';

class ProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Posts: [],
            User: null,
            role: "",
            username: localStorage.getItem("user"),
            editName: false,
            editEmail: false,
            editUsername: false,
            editPassword: false,
            editRole: false,
            editAbout: false,
            editSkills: false,
            editInterests: false,
            isAscending: false,
            userInput: {
                name: "",
                surname: "",
                email: "",
                username: "",
                role: "",
                oldpassword: "",
                newpassword: "",
                newpassword2: "",
                about: "",
                skills: "",
                interests: "",
            },
            status: {
                success: null, msg: ""
            },
        }
        this.req = axios.create({
            withCredentials: true, baseURL: API_URL, headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    async componentDidMount() {
        await this.getUserData()
    }

    SetValueFromUserInput = (event) => {
        this.setState(prevState => ({
            userInput: {
                ...prevState.userInput, [event.target.id]: event.target.value
            }
        }))
    }

    getUserData() {
        this.req.get('/profile/' + this.state.username)
            .then(response => {
                // this.setState({Posts: response.data.postData, User: response.data.userData})
                this.setState({
                    Posts: response.data["postData"], User: response.data["userData"], role: response.data["roleData"]
                }, () => {
                    if (this.state.role.includes("Helper") && this.state.role.includes("Seeler")) {
                        this.setState({roleShort: "both"})
                    } else if (this.state.role.includes("Helper")) {
                        this.setState({roleShort: "Helper"})
                    } else if (this.state.role.includes("Seeker")) {
                        this.setState({roleShort: "Seeker"})
                    } else this.setState(({roleShort: "Undefined"}))
                })
            })
            .catch(error => {
                console.error(error.response.status, error.response.data)
                this.props.changeState({CurrentPage: LOGIN})
            })
    }

    submitName = () => {
        this.setState(prevState => ({
            ...prevState, editName: false, userInput: {
                ...prevState.userInput, name: "", surname: ""
            }
        }))
        this.req.post('/profile/change-name-surname', {
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

    submitRole = () => {
        this.setState(prevState => ({
            ...prevState, editRole: false, userInput: {
                ...prevState.userInput, role: ""
            }
        }))
        this.req.post('/profile/change-role', {
            role: this.state.userInput.role, oldRole: this.state.roleShort, user: localStorage.getItem("user"),
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
        this.req.post('/profile/change-email', {
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

    submitUsername = () => {
        this.setState(prevState => ({
            ...prevState, editUsername: false
        }))
        this.req.post('/profile/change-username', {
            username: this.state.userInput.username, user: localStorage.getItem("user"),
        })
            .then(response => {
                this.setState({status: response.data, username: this.state.userInput.username}, () => {
                    localStorage.setItem("user", this.state.userInput.username);
                    this.setState(prevState => ({
                        ...prevState, userInput: {...prevState.userInput, username: ""}
                    }));
                    this.getUserData()
                })
            })
            .catch(error => {
                this.setState({status: error.response.data})
                console.log(error.response.data)
            })
    }

    submitPassword = () => {
        this.setState(prevState => ({
            ...prevState, editPassword: false, userInput: {
                ...prevState.userInput, oldpassword: "", newpassword: "", newpassword2: ""
            }
        }))
        this.req.post('/profile/change-password', {
            oldpassword: this.state.userInput.oldpassword,
            newpassword: this.state.userInput.newpassword,
            newpassword2: this.state.userInput.newpassword2,
            user: localStorage.getItem("user"),
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

    submitAbout = () => {
        this.setState(prevState => ({
            ...prevState, editAbout: false, userInput: {
                ...prevState.userInput, about: ""
            }
        }))
        this.req.post('/profile/change-about', {
            about: this.state.userInput.about, user: localStorage.getItem("user"),
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

    submitSkills = () => {
        this.setState(prevState => ({
            ...prevState, editSkills: false, userInput: {
                ...prevState.userInput, skills: ""
            }
        }))
        this.req.post('/profile/change-skills', {
            skills: this.state.userInput.skills, user: localStorage.getItem("user"),
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

    submitInterests = () => {
        this.setState(prevState => ({
            ...prevState, editInterests: false, userInput: {
                ...prevState.userInput, interests: ""
            }
        }))
        this.req.post('/profile/change-interests', {
            interests: this.state.userInput.interests, user: localStorage.getItem("user"),
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

    editPost = (d) => {
        this.props.changeState({postData: {title: d.title, body: d.body, editExistingPostData: "edit", old_post_id: d.id}, CurrentPage: ADDPOST})
    }

    deletePost = (id) => {
        this.req.delete('posts/' + id).then(response => {
            this.setState({status: response.data})
            this.getUserData()
        }).catch(error => {
            console.log(error)
        })
    }

    sortByDate = () => {
        this.setState(prevState => ({
            Posts: [...prevState.Posts].reverse(), isAscending: !this.state.isAscending
        }));
    }

    render() {
        const p = this.state.Posts
        if (this.state.User === null) {
            return <div>No user logged in! Please log in first.</div>
        }

        return <div className="card" style={{margin: "10px"}}>
            <div className="card-body">

                {/*CHANGE NAME/SURNAME*/}
                <div className={"d-flex align-items-center"}>
                    {!this.state.editName ? <>
                        <h1 className="card-title"><b>{this.state.User.name} {this.state.User.surname}</b></h1>
                        <button onClick={() => this.setState(prevState => ({
                            ...prevState, editName: true, userInput: {
                                ...prevState.userInput, name: prevState.User.name, surname: prevState.User.surname
                            }
                        }))}
                                className={"btn btn-primary btn-md ms-auto"}>Edit
                            Name/Surname
                        </button>
                    </> : <>
                        <div className="row mb-3">
                            <div className="col">
                                <label htmlFor="name"><h5>First name</h5></label>
                                <input onChange={this.SetValueFromUserInput}
                                       type="text"
                                       className="form-control"
                                       id="name"
                                       defaultValue={this.state.User.name}
                                       autoComplete="off"/>
                            </div>

                            <div className="col">
                                <label htmlFor="surname"><h5>Last name</h5></label>
                                <input onChange={this.SetValueFromUserInput}
                                       type="text"
                                       className="form-control"
                                       id="surname"
                                       defaultValue={this.state.User.surname}
                                       autoComplete="off"/>
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
                    </>}
                </div>

                <div className={"d-flex align-items-center w-100"}>
                    {!this.state.editRole ? <>
                        <div>
                            Role: {this.state.role}
                        </div>
                        <div className="ms-auto">
                            <button onClick={() => this.setState({editRole: true})}
                                    className={"btn btn-primary btn-sm ms-auto"}>Change role
                            </button>
                        </div>
                    </> : <>
                        <div className="mb-3 w-50">
                            <label htmlFor="role">What is your role?</label>
                            <select onChange={this.SetValueFromUserInput} className="form-control w-100" id="role"
                                    autoComplete="off">
                                <option value="">Select an option</option>
                                <option value="Helper">Helper, I want to help people</option>
                                <option value="Seeker">Seeker, I want to ask for help</option>
                                <option value="both">Both helping and requesting help...</option>
                            </select>
                        </div>
                        <div className="ms-auto">
                            <button onClick={this.submitRole}
                                    className={"btn btn-success btn-sm me-1"}>Submit
                            </button>
                            <button onClick={() => this.setState({editRole: false})}
                                    className={"btn btn-danger btn-sm ms-auto"}>Cancel
                            </button>
                        </div>
                    </>}
                </div>

                <hr/>
                <div className={"d-flex align-items-center w-100"}>

                </div>

                {/*CHANGE EMAIL*/}
                <div className={"d-flex align-items-center"}>
                    {!this.state.editEmail ? <>
                        <h5 className="card-title">E-mail: <b>{this.state.User.email}</b></h5>
                        <button onClick={() => this.setState(prevState => ({
                            ...prevState, editEmail: true, userInput: {
                                ...prevState.userInput, email: prevState.User.email
                            }
                        }))}
                                className={"btn btn-primary btn-sm ms-auto"}>Update E-mail
                        </button>
                    </> : <>
                        <div className="row mb-0">
                            <div className="col-auto">
                                <label htmlFor="email" className="col-form-label">E-mail:</label>
                            </div>
                            <div className={"col"}>
                                <input onChange={this.SetValueFromUserInput}
                                       type="text"
                                       className="form-control"
                                       id="email"
                                       defaultValue={this.state.User.email}
                                       autoComplete="off"/>
                            </div>
                        </div>
                        <div className="ms-auto">
                            <button onClick={this.submitEmail}
                                    className={"btn btn-success btn-sm me-1"}>Submit
                            </button>
                            <button onClick={() => this.setState({editEmail: false})}
                                    className={"btn btn-danger btn-sm ms-auto"}>Cancel
                            </button>
                        </div>
                    </>}
                </div>

                {/*CHANGE USERNAME*/}
                <div className={"d-flex align-items-center"}>
                    {!this.state.editUsername ? <>
                        <h5 className="card-title">Username: <b>{this.state.User.username}</b></h5>
                        <button onClick={() => this.setState(prevState => ({
                            ...prevState, editUsername: true, userInput: {
                                ...prevState.userInput, username: prevState.User.username
                            }
                        }))}
                                className={"btn btn-primary btn-sm ms-auto"}>Edit username
                        </button>
                    </> : <>
                        <div className="row mb-0">
                            <div className="col-auto">
                                <label htmlFor="username" className="col-form-label">Username:</label>
                            </div>
                            <div className="col">
                                <input onChange={this.SetValueFromUserInput}
                                       type="text"
                                       className="form-control"
                                       id="username"
                                       defaultValue={this.state.User.username}
                                       autoComplete="off"/>
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
                    </>}
                </div>

                {/*CHANGE PASSWORD*/}
                <div className={"d-flex align-items-center"}>
                    {!this.state.editPassword ? <>
                        <h5>Feel like you have a weak password? Change it now</h5>
                        <button onClick={() => this.setState({editPassword: true})}
                                className={"btn btn-primary btn-sm ms-auto"}>Change password
                        </button>
                    </> : <>
                        <div className="row mb-3">
                            <div className="col">
                                <label htmlFor="oldpassword">Old password</label>
                                <input onChange={this.SetValueFromUserInput} type="password"
                                       className="form-control"
                                       id="oldpassword"
                                       placeholder=""
                                       autoComplete="off"/>
                            </div>
                            <div className="col">
                                <label htmlFor="newpassword">New password</label>
                                <input onChange={this.SetValueFromUserInput} type="password"
                                       className="form-control"
                                       id="newpassword"
                                       placeholder=""
                                       autoComplete="off"/>
                            </div>
                            <div className="col">
                                <label htmlFor="newpassword2">Repeat new password</label>
                                <input onChange={this.SetValueFromUserInput} type="password"
                                       className="form-control"
                                       id="newpassword2"
                                       placeholder=""
                                       autoComplete="off"/>
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
                    </>}
                </div>
                {/*<hr/>*/}


                <div className="card mt-2">
                    <div className="card-body">
                        <div>
                            <div className={"d-flex align-items-center"}>
                                <div className="card-title mb-1"><h5>About</h5></div>
                                <div className="ms-auto">
                                    {!this.state.editAbout ? <button onClick={() => this.setState(prevState => ({
                                        ...prevState, editAbout: true, userInput: {
                                            ...prevState.userInput, about: this.state.User.about
                                        }
                                    }))}
                                                                     className="btn btn-secondary btn-md ms-auto">
                                        Edit 'About me'
                                    </button> : <>
                                        <div className="ms-auto">
                                            <button onClick={this.submitAbout}
                                                    className={"btn btn-success btn-sm me-1"}>Submit
                                            </button>
                                            <button onClick={() => this.setState({editAbout: false})}
                                                    className={"btn btn-danger btn-sm ms-auto"}>Cancel
                                            </button>
                                        </div>
                                    </>}

                                </div>
                            </div>
                            {!this.state.editAbout ? <div className="card-text mb-3 mt-1">{this.state.User.about}
                                {/*// TODO: when changing roles, do not remove About everytime*/}
                            </div> : <>
                                <div className="mb-3 m-3">
                                    <textarea name="about"
                                              id="about"
                                              className="form-control"
                                              rows="3"
                                              onChange={this.SetValueFromUserInput}
                                              defaultValue={this.state.User.about}
                                              autoComplete="off"/>
                                </div>
                            </>}
                        </div>

                        {this.state.role.includes("Helper") ? <div>
                            <hr/>
                            <div className={"d-flex align-items-center"}>
                                <div className="card-title mb-1"><h5>Skills</h5></div>
                                {!this.state.editSkills ? <button onClick={() => this.setState(prevState => ({
                                    ...prevState, editSkills: true, userInput: {
                                        ...prevState.userInput, skills: this.state.User.skills
                                    }
                                }))}
                                                                  className="btn btn-secondary btn-md ms-auto">Add new
                                    'Skills'
                                </button> : (<>
                                    <div className="ms-auto">
                                        <button onClick={this.submitSkills}
                                                className={"btn btn-success btn-sm me-1"}>Submit
                                        </button>
                                        <button onClick={() => this.setState({editSkills: false})}
                                                className={"btn btn-danger btn-sm ms-auto"}>Cancel
                                        </button>
                                    </div>
                                </>)}

                            </div>
                            {!this.state.editSkills ? <div className="card-text mb-3 mt-1">{this.state.User.skills}
                                {/*<hr/>*/}
                            </div> : (<>
                                <div className="mb-3 m-3">
                                    <textarea name="skills"
                                              id="skills"
                                              className="form-control"
                                              rows="2"
                                              onChange={this.SetValueFromUserInput}
                                              defaultValue={this.state.User.skills}
                                              autoComplete="off"/>
                                </div>
                            </>)}
                        </div> : null}

                        {this.state.role.includes("Seeker") ? <div>
                            <hr/>
                            <div className={"d-flex align-items-center"}>
                                <div className="card-title mb-1"><h5>Interests</h5></div>
                                {!this.state.editInterests ? <button onClick={() => this.setState(prevState => ({
                                    ...prevState, editInterests: true, userInput: {
                                        ...prevState.userInput, interests: this.state.User.interests
                                    }
                                }))}
                                                                     className="btn btn-secondary btn-md ms-auto">Update
                                    'Interests'
                                </button> : (<>
                                    <div className="ms-auto">
                                        <button onClick={this.submitInterests}
                                                className={"btn btn-success btn-sm me-1"}>Submit
                                        </button>
                                        <button onClick={() => this.setState({editInterests: false})}
                                                className={"btn btn-danger btn-sm ms-auto"}>Cancel
                                        </button>
                                    </div>
                                </>)}

                            </div>
                            {!this.state.editInterests ?
                                <div className="card-text mb-3 mt-1">{this.state.User.interests}
                                </div> : (<>
                                    <div className="mb-3 m-3">
                                    <textarea name="interests"
                                              id="interests"
                                              className="form-control"
                                              rows="2"
                                              onChange={this.SetValueFromUserInput}
                                              defaultValue={this.state.User.interests}
                                              autoComplete="off"/>
                                    </div>
                                </>)}
                        </div> : null}

                    </div>
                </div>


                <div className={"mt-3"}>
                    {this.state.status.success ?
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            {this.state.status.msg}
                            <button onClick={() => this.setState({status: {success: null, msg: ""}})}
                                    type="button" className="btn-close" data-bs-dismiss="alert"
                                    aria-label="Close"></button>
                        </div> : null}

                    {!this.state.status.success && this.state.status.msg !== "" ?
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {this.state.status.msg}
                            <button onClick={() => this.setState({status: {success: null, msg: ""}})}
                                    type="button" className="btn-close" data-bs-dismiss="alert"
                                    aria-label="Close"></button>
                        </div> : null}
                </div>


                {/*ALL POSTS AUTHORED*/}
                <div className="row row-cols-1 g-4" style={{margin: "10px"}}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className={"card-title"} style={{fontWeight: "bold"}}>All posts asking/requesting for
                            help:</h4>
                        <button
                            onClick={this.sortByDate}
                            className="btn btn-outline-primary"
                            style={{marginLeft: "auto"}}
                        >
                            Sort by Date
                            <span className="badge badge-dark">
                                {this.state.isAscending ? (<i className="bi bi-arrow-up text-primary"></i>) : (
                                    <i className="bi bi-arrow-down text-primary"></i>)}
                            </span>
                        </button>

                    </div>
                    {p.length > 0 ? p.map((d) => {
                        return <div className="col" key={d.id}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{d.title}</h5>
                                    <p className="card-text">{d.body}</p>
                                    <button onClick={() => this.props.changeState({CurrentPage: POST, id: d.id})}
                                            style={{margin: "10px"}} className="btn btn-primary bt">Read more
                                    </button>
                                    <button onClick={() => this.editPost(d)}
                                            style={{margin: "10px"}} className="btn btn-secondary bt">Edit
                                    </button>
                                    <button onClick={() => this.deletePost(d.id)}
                                            style={{margin: "10px"}} className="btn btn-danger bt">Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    }) : "No help requested yet"}
                </div>


            </div>
        </div>
    }

}

export default ProfileView
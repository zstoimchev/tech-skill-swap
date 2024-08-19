import React from "react"
import axios from "axios"
import {API_URL} from "../Utils/Configuration"
import 'bootstrap-icons/font/bootstrap-icons.css'
import {LOGIN, POST} from "../Utils/Constants";

class AuthorView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Posts: [], User: {
                name: "", surname: "", email: "", username: "", role: "",
            }, username: this.props.username, status: {
                success: null, msg: ""
            }, role: "Helper Seeker", showComments: false, comments: [],
        }
        this.req = axios.create({
            withCredentials: true, baseURL: API_URL, headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    async componentDidMount() {
        console.log(this.props.username)
        this.setState({username: this.props.username})
        await this.getUserData()
    }

    getCommentsFromUser = () => {
        this.req.get('profile/comments/' + this.state.User.username).then(response => {
            this.setState({comments: response.data.comments})
        }).catch(error => {
            this.setState({status: error.response.data})
            console.error(error.response.data)
        })
    }

    getUserData() {
        this.req.get('/profile/' + this.props.username)
            .then(response => {
                this.setState({
                    Posts: response.data["postData"], User: response.data["userData"], role: response.data["roleData"]
                }, () => {
                    this.getCommentsFromUser();
                })
            })
            .catch(error => {
                console.error(error.response.status, error.response.data)
                this.props.changeState({CurrentPage: LOGIN})
            })
    }

    sortByDate = () => {
        this.setState(prevState => ({
            Posts: [...prevState.Posts].reverse(),
            comments: [...prevState.comments].reverse(),
            isAscending: !this.state.isAscending
        }))
    }

    render() {
        const p = this.state.Posts
        if (this.state.User === null) {
            return <div>No user logged in! Please log in first.</div>
        }

        return <div className="card" style={{margin: "10px"}}>
            <div className="card-body">

                <div className={"d-flex align-items-center"}>
                    <h1 className="card-title"><b>{this.state.User.name} {this.state.User.surname}</b></h1>
                    <button
                        className={"btn btn-outline-primary btn-lg ms-auto"}
                        onClick={() => window.location = `mailto:${this.state.User.email}`}>Contact
                    </button>
                </div>

                <div className={"d-flex align-items-center w-100"}>
                    <div>
                        Role: {this.state.role}
                    </div>
                </div>
                <hr/>

                <div className={"d-flex align-items-center"}>
                    <h5 className="card-title">E-mail: <b>{this.state.User.email}</b></h5>
                </div>

                <div className={"d-flex align-items-center"}>
                    <h5 className="card-title">Username: <b>{this.state.User.username}</b></h5>
                </div>


                <div className="card mt-2">
                    <div className="card-body">
                        <div>
                            <div className={"d-flex align-items-center"}>
                                <div className="card-title mb-1"><h5>About</h5></div>
                            </div>
                            <div className="card-text mb-3 mt-1">
                                {this.state.User.about}
                            </div>
                        </div>

                        {this.state.role.includes("Helper") ? <div>
                            <hr/>
                            <div className={"d-flex flex-column"}>
                                <div className="card-title mb-1"><h5>Skills</h5></div>
                                <div className="card-text mb-3 mt-1">{this.state.User.skills}</div>
                            </div>
                        </div> : null}

                        {this.state.role.includes("Seeker") ? <div>
                            <hr/>
                            <div className={"d-flex flex-column"}>
                                <div className="card-title mb-1"><h5>Interests</h5></div>
                                <div className="card-text mb-3 mt-1">{this.state.User.interests}</div>
                            </div>
                        </div> : null}

                    </div>
                </div>


                <div className={'mt-3'}>
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
                        {!this.state.showComments ?
                            <h4 className={"card-title"} style={{fontWeight: "bold"}}>All posts asking/requesting for
                                help:</h4> :
                            <h4 className={"card-title"} style={{fontWeight: "bold"}}>All comments even recorded</h4>}
                        <div>
                            <button
                                className={"btn btn-outline-secondary btn-md ms-auto me-1"}
                                onClick={() => this.setState({showComments: !this.state.showComments})}>
                                {!this.state.showComments ? "View Comments" : "View Posts"}
                            </button>
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
                    </div>
                    {!this.state.showComments ? <>
                        {p.length > 0 ? p.map((d) => {
                            return <div className="col" key={d.id}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{d.title}</h5>
                                        <p className="card-text">{d.body}</p>
                                        <button onClick={() => this.props.changeState({CurrentPage: POST, id: d.id})}
                                                style={{margin: "10px"}} className="btn btn-primary bt">Read more
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }) : "No help requested yet"}
                    </> : null}
                    {this.state.showComments ? <>
                        {this.state.comments.length > 0 ? this.state.comments.map((d) => {
                            const date = new Date(d.date)
                            const options = {year: 'numeric', month: '2-digit', day: '2-digit'}
                            const formattedDate = date.toLocaleDateString('en-GB', options) + ' @ ' + date.toLocaleTimeString()
                            return <div className="col mb-0" key={d.id}>
                                <div className="card-body p-0">
                                    <div className="d-flex justify-content-between align-items-center mb-0">
                                        <h5 className="mb-0">Post Title: {d.title} - {formattedDate}</h5>
                                        <button onClick={() => this.props.changeState({CurrentPage: POST, id: d.id})}
                                                style={{margin: "10px"}} className="btn btn-md btn-primary mb-0">Visit
                                            Post
                                        </button>
                                    </div>
                                    <p className="mt-0 mb-0">Content: {d.content}</p>
                                </div>
                            </div>
                        }) : "No comments found yet"}</> : null}

                </div>

            </div>
        </div>
    }
}

export default AuthorView
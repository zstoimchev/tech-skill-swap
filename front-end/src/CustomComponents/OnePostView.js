import React from "react"
import PropTypes from 'prop-types'
import axios from 'axios'
import {API_URL} from "../Utils/Configuration"
import {AUTHOR, HOME, LOGIN, POSTS} from "../Utils/Constants"
import './style.css'
import Rating from '@mui/material/Rating'

class OnePostView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {}, comments: {}, user: {
                comment: "", rating: 0, username: localStorage.getItem("user"),
            }, status: {
                success: null, msg: "", rating: null
            }, rating: 0,
        }
        this.req = axios.create({
            withCredentials: true, baseURL: API_URL, headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
    }


    componentDidMount() {
        this.setState({id: this.props.id})
        this.req.get('/posts/' + this.props.id)
            .then(response => {
                if (response.data.success && response.data["arr"]) {
                    this.setState({
                        post: response.data["arr"]
                    })
                    this.fetchComments()
                    this.fetchRatings()
                    this.fetchRatingForUser()
                } else {
                    console.log("No post data received");
                }
            })
            .catch(error => {
                if (error.response.status === 401 || error.response.status === 403) {
                    console.error(error.response.data)
                    console.error(error.response.status)
                    // window.location.hash = "login"
                    this.props.changeState({CurrentPage: LOGIN})
                } else {
                    console.log(error.response)
                    // window.location.hash = "home"
                    this.props.changeState({CurrentPage: HOME})
                }
            })
    }

    fetchRatings = () => {
        this.req.get('/rating/' + this.state.id).then(response => {
            this.setState({status: response.data, rating: response.data.rating})
        }).catch(err => {
            console.error(err)
        })
    }

    submitRating = (value) => {
        this.req.post('/rating/add', {
            user: this.state.user.username, post_id: this.state.id, value: value
        }).then(response => {
            this.setState(prevState => ({
                user: {...prevState.user, rating: value}, status: response.data,
            }), () => {
                this.fetchRatings()
            })
        }).catch(err => {
            console.error(err)
        })
    }

    fetchRatingForUser = () => {
        this.req.get('/rating/fetch-user/' + this.state.id + '/' + this.state.user.username)
            .then(response => {
                this.setState(prevState => ({
                    user: {...prevState.user, rating: response.data.rating}, status: response.data,
                }), () => {
                    this.fetchRatings()
                })
            }).catch(err => {
            console.error(err)
        })
    }

    Send() {
        this.req.post('/posts/comment', {
            user: this.state.user.username, post_id: this.state.id, content: this.state.user.comment,
        })
            .then(response => {
                this.setState({status: response.data})
                console.log(response.data)
                this.fetchComments()
            })
            .catch(error => {
                console.error(error.response.data);
                this.setState({status: error.response.data})
                // this.props.changeState({CurrentPage: LOGIN})
            })
    }

    fetchComments() {
        this.req.get('/posts/comment/' + this.state.id)
            .then(response => {
                if (response.data.success && response.data["arr"]) {
                    const options = {year: 'numeric', month: '2-digit', day: '2-digit'}
                    const comments = response.data["arr"].map(comment => {
                        const date = new Date(comment.date)
                        comment.date = date.toLocaleDateString('en-GB', options) + ' @ ' + date.toLocaleTimeString()
                        return comment;
                    })
                    this.setState({
                        comments: comments
                    })
                } else {
                    console.log("No comments data received")
                }
            })
            .catch(error => {
                this.setState({status: error.response.data})
                console.error(error.response.data);
            })
    }

    SetValueFromUserInput = (e) => {
        this.setState(prevState => ({
            user: {...prevState.user, [e.target.id]: e.target.value}
        }))
    }

    editComment = (id) => {
        // this.req.post('profile/comments/' + id).then(response => {
        //     this.fetchComments()
        // }).catch(err => {
        //     this.setState({status: err.response.data})
        // })
        console.log("here toggle input box")
    }


    deleteComment = (id) => {
        this.req.delete('profile/comments/' + id).then(response => {
            this.fetchComments()
        }).catch(err => {
            this.setState({status: err.response.data})
        })
    }

    render() {
        let post = this.state.post
        const comments = this.state.comments
        const date = new Date(this.state.post["created_at"])
        const options = {year: 'numeric', month: '2-digit', day: '2-digit'}
        const formattedDate = date.toLocaleDateString('en-GB', options) + ' @ ' + date.toLocaleTimeString()
        return (<div className="card" style={{margin: "10px"}}>
            {Object.keys(post).length !== 0 ? <div className="card-body">
                <h4 className="card-title">{post.title} - {formattedDate}</h4>
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title">Category: {this.state.post["category_name"]}</h5>
                        <h5 className="card-title">Author: {this.state.post.name} {this.state.post.surname}</h5>
                    </div>
                    <p className="card-title">{post.body}</p>
                    <img className="img-fluid my-custom-image" src={API_URL + "/" + post.image} alt={""}></img>

                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <button onClick={() => this.props.changeState({CurrentPage: POSTS})}
                                    className="btn btn-primary m-1 ">Return news
                            </button>
                            <button onClick={() => this.props.changeState({
                                author: this.state.post.username, CurrentPage: AUTHOR
                            })}
                                    className="btn btn-outline-primary m-1 ">Visit Author Profile
                            </button>
                            <button onClick={() => window.location = `mailto:${this.state.post.email}`}
                                    className="btn btn-outline-success m-1">Contact Author
                            </button>
                        </div>


                        <div className="d-flex flex-column align-items-end">
                            <label>Your rating: {this.state.user.rating} / Average: {this.state.rating}</label>
                            <Rating
                                name="simple-controlled"
                                size="large"
                                value={this.state.rating}
                                onChange={(event) => {
                                    this.submitRating(event.target["value"])
                                }}
                            />
                        </div>


                    </div>
                </div>

                <hr/>
                <div className="card-body" style={{paddingTop: "0px"}}>
                    <h5 style={{marginBottom: "10px"}}>Leave a comment:</h5>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <input id="comment" type="text" className="form-control" placeholder="Enter your comment here"
                               value={this.state.user.comment}
                               style={{marginRight: "10px", flex: "1"}} onChange={this.SetValueFromUserInput}/>
                        <button className="btn btn-primary"
                                onClick={() => {
                                    this.Send()
                                    this.setState(prevState => ({
                                        user: {...prevState.user, comment: ""}
                                    }))
                                }}
                        >Post
                        </button>
                    </div>
                </div>
                <hr/>
                <div className="card-body" style={{paddingTop: "0px"}}>
                    <h5>Other comments:</h5>
                    {comments.length > 0 ? comments.map((d) => {
                        return (<div key={d.id} className="d-flex justify-content-between align-items-center">
                            <p><b>{d.username}</b>: {d.content} - <i>{d.date}</i></p>
                            {this.state.user.username === d.username ? <div className="d-flex">
                                <button onClick={() => this.editComment}
                                        className="btn btn-sm btn-outline-primary m-1 text-nowrap">Edit Comment
                                </button>
                                <button onClick={() => this.deleteComment(d.id)}
                                        className="btn btn-sm btn-outline-danger m-1 text-nowrap">Delete Comment
                                </button>
                            </div> : null}</div>)
                    }) : "There are no comments yet..."}
                </div>

            </div> : "Loading..."}
        </div>)
    }
}

OnePostView.propTypes = {
    changeState: PropTypes.func.isRequired, id: PropTypes.number.isRequired
}

export default OnePostView
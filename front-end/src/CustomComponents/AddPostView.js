import React from "react";
import axios from "axios";
import {API_URL} from "../Utils/Configuration";

class AddPostView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            post: {
                title: "", body: "", img: null
            }, status: {
                success: null, msg: ""
            }
        }
    }

    SetValueFromUserInput = (e) => {
        this.setState(prevState => ({
            post: {...prevState.post, [e.target.name]: e.target.value}
        }))
    }

    SetFileFromUserInput = (e) => {
        this.setState(prevState => ({
            post: {...prevState.post, img: e.target.files[0]}
        }))
    }


    AddPost = () => {
        if (this.state.post.title === "" || this.state.post.body === "") {
            this.setState({status: {success: false, msg: "Missing input filed"}})
            return
        }

        const data = new FormData();
        data.append('title', this.state.post.title)
        data.append('body', this.state.post.body)
        data.append('user_id', 1)
        data.append('file', this.state.post.img)

        let api = axios.create({
            timeout: 20000, withCredentials: true
        })

        api.post(API_URL + '/posts/add', data)
            .then(response => {
                console.log("Sent to server...")
                this.setState({status: response.data})
            })
            .catch(err => {
                console.log(err)
            })
    }


    render() {
        return (<div className="card"
                     style={{margin: "10px"}}>
            <h3 style={{margin: "10px"}}>Welcome user</h3>

            <div className="mb-3"
                 style={{margin: "10px"}}>
                <label className="form-label">Title</label>
                <input name="title" type="text"
                       onChange={this.SetValueFromUserInput.bind(this)}
                       className="form-control"
                       placeholder="Title"/>
            </div>

            <div className="mb-3"
                 style={{margin: "10px"}}>
                <label className="form-label">Body</label>
                <input name="body" type="text"
                       onChange={this.SetValueFromUserInput.bind(this)}
                       className="form-control"
                       placeholder="Briefly describe your problem..."/>
            </div>


            <div className="mb-3">
                <label form="file" className="form-label">Select related image describing your problem
                    (optional)</label>
                <input className="form-control" type="file" id="file" name="file"
                       onChange={this.SetFileFromUserInput.bind(this)}/>
            </div>


            <button className="btn btn-primary bt" onClick={() => this.AddPost()}
                    style={{margin: "10px"}}>
                Submit new Post
            </button>


            {this.state.status.success ? <p className="alert alert-success"
                                            role="alert">{this.state.status.msg}</p> : null}

            {!this.state.status.success && this.state.status.msg !== "" ? <p className="alert alert-danger"
                                                                             role="alert">{this.state.status.msg}</p> : null}
        </div>)
    }
}

export default AddPostView
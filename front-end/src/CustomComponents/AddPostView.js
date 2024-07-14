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
            post: {...prevState.user, [e.target.id]: e.target.value}
        }))
    }


    AddPost = () => {
        if (this.state.post.title === "" || this.state.post.body === "") {
            this.setState({status: {success: false, msg: "Missing input filed"}})
            return
        }

        const data = new FormData();
        data.append('image', this.state.post.img)
        data.append('title', this.state.post.title)
        data.append('text', this.state.post.body)

        let req = axios.create({
            timeout: 20000, withCredentials: true
        });

        req.post(API_URL + '/novice', data)
            .then(response => {
                /// TODO: You should indicate if the element was added, or if not show the error
                this.setState({status: response.data})
                console.log("Sent to server...")
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
                       placeholder="Title..."/>
            </div>

            <div className="mb-3"
                 style={{margin: "10px"}}>
                <label className="form-label">Body</label>
                <input name="slug" type="text"
                       onChange={this.SetValueFromUserInput.bind(this)}
                       className="form-control"
                       placeholder="Slug..."/>
            </div>


            <div className="mb-3">
                <label for="formFile" class="form-label">Select related image describing your problem (optional)</label>
                <input class="form-control" type="file" id="file" name="file"
                       onChange={this.SetValueFromUserInput.bind(this)}/>
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
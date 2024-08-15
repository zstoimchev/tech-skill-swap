import React from "react";
import axios from "axios";
import {API_URL} from "../Utils/Configuration";
import {POST} from "../Utils/Constants";

class AddPostView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            category: [], post: {
                title: "", body: "", img: null, category: "1"
            }, status: {
                success: null, msg: "", id: null
            }, editCat: false,
        }
    }

    componentDidMount() {
        this.setState(prevState => ({
            post: {
                ...prevState.post, title: this.props.postData.title, body: this.props.postData.body,
            }
        }), () => this.props.changeState({postData: {title: "", body: ""}}))


        axios.get(API_URL + '/posts/category/get/').then(res => {
            this.setState({category: res.data["arr"]})
            // this.setState({status: res.data})
        }).catch(err => {
            console.error(err)
            this.setState({status: err.response.data})
        })
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
        data.append('username', localStorage.getItem('user'))
        data.append('category', this.state.post.category)
        data.append('file', this.state.post.img)

        const token = localStorage.getItem("token")

        let api = axios.create({
            timeout: 20000, withCredentials: true, headers: {
                'Authorization': `Bearer ${token}`
            },
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

    VisitPost = () => {
        this.props.changeState({CurrentPage: POST, id: this.state.status.id})
    }


    render() {
        return (<div className="card"
                     style={{margin: "10px"}}>
            <h3 style={{margin: "10px"}}>Welcome user</h3>

            <div className="mb-3"
                 style={{margin: "10px"}}>
                <label htmlFor="title" className="form-label">Title</label>
                <input name="title" type="text" id="title"
                       onChange={this.SetValueFromUserInput.bind(this)}
                       className="form-control"
                       placeholder="Title"
                       value={this.state.post.title}
                />
            </div>

            <div className="mb-3"
                 style={{margin: "10px"}}>
                <label htmlFor="body" className="form-label">Body</label>
                <div className="mb-3 m-3">
                    <textarea name="body"
                              id="body"
                              className="form-control"
                              rows="5"
                              onChange={this.SetValueFromUserInput.bind(this)}
                              placeholder="Briefly describe your problem"
                              value={this.state.post.body}
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="mb-3 col">
                    <label htmlFor="category" className="form-label">Select the category best describing your
                        problem:</label>
                    {!this.state.editCat ?
                        <select onChange={this.SetValueFromUserInput} className="form-control w-100" id="category"
                                name="category">
                            <option value="1">Select a category (default is 'other')</option>
                            {this.state.category.map((item, index) => (
                                <option key={index} value={item.id}>{item.name}</option>))}
                            <option onClick={() => this.setState({editCat: true})}>Add new category</option>
                        </select> : <div className="d-flex align-items-center">
                            <input onChange={this.SetValueFromUserInput}
                                   type="text" className="form-control"
                                   id="category"
                                   name="category"
                                   placeholder="Enter the name of the new category"/>
                            <button onClick={() => this.setState({editCat: false})} className="btn btn-light ml-2">X
                            </button>
                        </div>}
                </div>

                <div className="mb-3 col">
                    <label htmlFor="file" form="file" className="form-label">Select related image describing your
                        problem
                        (optional)</label>
                    <input className="form-control" type="file" id="file" name="file"
                           onChange={this.SetFileFromUserInput.bind(this)}/>
                </div>
            </div>

            {!this.state.status.success ? <button className="btn btn-primary bt" onClick={() => this.AddPost()}
                                                  style={{margin: "10px"}}>
                Submit new Post
            </button> : null}
            {this.state.status.success ? <button className="btn btn-primary bt" onClick={() => this.VisitPost()}
                                                 style={{margin: "10px"}}>
                View your post
            </button> : null}

            {this.state.status.success ? <p className="alert alert-success"
                                            role="alert">{this.state.status.msg}</p> : null}

            {!this.state.status.success && this.state.status.msg !== "" ? <p className="alert alert-danger"
                                                                             role="alert">{this.state.status.msg}</p> : null}
        </div>)
    }
}

export default AddPostView
import React from "react";
import axios from "axios";
import {API_URL} from "../Utils/Configuration";
import {POST} from "../Utils/Constants";

class PostsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Posts: [], payload: "",
        }
        this.req = axios.create({
            withCredentials: true, baseURL: API_URL, headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    componentDidMount() {
        this.fetchAllPosts()
    }

    fetchAllPosts = () => {
        axios.get(API_URL + '/posts')
            .then(response => {
                if (Array.isArray(response.data.arr)) {
                    this.setState({
                        Posts: response.data.arr
                    })
                } else {
                    console.error(response.data.msg);
                }
            })
            .catch(error => {
                // Handle the error here
                console.error("---------- An error occurred while fetching posts ----------")
                console.log(error)
            })
    }

    SetValueFromUserInput = (event) => {
        this.setState({ [event.target.id]: event.target.value }, () => {
            if (this.state.payload === '') {
                this.fetchAllPosts();
            } else {
                this.PerformSearchInDb()
            }
        })
    }

    PerformSearchInDb = () => {
        this.req.get('/posts/search/' + this.state.payload)
            .then(response => {
                if (Array.isArray(response.data.posts)) {
                    this.setState({
                        Posts: response.data.posts
                    })
                } else {
                    console.error(response.data.msg)
                }
            })
            .catch(error => {
                this.setState({status: error.response.data, Posts: []})
                console.log(error.response.data)
            })
    }


    render() {
        const data = this.state.Posts
        return (<div>

            <div className="row row-cols-1 row-cols-md-3 g-4" style={{margin: "10px"}}>
                {/*<h3 className="input-group">Browse the content free of charge</h3>*/}
                <div className="w-100 d-flex justify-content-center">
                    <h3>Browse the content free of charge</h3>
                </div>

                <div className="input-group">
                    <div className="input-group-append">
                        <select onChange={this.SetValueFromUserInput} className="form-control w-100" id="role">
                            <option value="">Toggle Category</option>
                            <option value="Helper">Helper, I want to help people</option>
                            <option value="Seeker">Seeker, I want to ask for help</option>
                            <option value="both">Both helping and requesting help...</option>
                        </select>
                    </div>
                    <input id="payload" type="search" className="form-control rounded" placeholder="Search"
                           aria-label="Search"
                           aria-describedby="search-addon" onChange={this.SetValueFromUserInput}/>


                    <button onClick={this.PerformSearchInDb} type="button" className="btn btn-outline-primary"
                            data-mdb-ripple-init="">search
                    </button>
                </div>


                {data.length > 0 ? data.map((d) => {
                    const date = new Date(d["created_at"])
                    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
                    const formattedDate = date.toLocaleDateString('en-GB', options) + ' @ ' + date.toLocaleTimeString()
                    return (<div className="col" key={d.id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{d.title}</h5>
                                <p style={{height: "5rem", overflow: "hidden"}}
                                   className="card-text">{d.body}</p>
                                <p className="card-text">
                                    Author: {d.name} {d.surname}<br/>
                                    Published on: {formattedDate}
                                </p>
                            </div>
                            <button onClick={() => this.props.changeState({CurrentPage: POST, id: d.id})}
                                    style={{margin: "10px"}} className="btn btn-primary bt">Read more
                            </button>
                        </div>
                    </div>)
                }) : "No posts found yet..."}
            </div>

        </div>)
    }

}

export default PostsView
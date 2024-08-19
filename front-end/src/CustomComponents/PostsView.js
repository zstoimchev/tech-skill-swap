import React from "react";
import axios from "axios";
import {API_URL} from "../Utils/Configuration";
import {POST} from "../Utils/Constants";
import Dropdown from 'react-bootstrap/Dropdown';

class PostsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Posts: [], payload: "", cat: [], isAscending: false,
        }
        this.req = axios.create({
            withCredentials: true, baseURL: API_URL, headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    componentDidMount() {
        this.fetchAllPosts()
        this.fetchCategories()
    }

    fetchAllPosts = () => {
        axios.get(API_URL + '/posts')
            .then(response => {
                if (Array.isArray(response.data["arr"])) {
                    this.setState({
                        Posts: response.data["arr"]
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

    fetchCategories = () => {
        axios.get(API_URL + '/posts/category/get')
            .then(response => {
                if (Array.isArray(response.data["arr"])) {
                    this.setState({
                        cat: response.data["arr"]
                    })
                } else {
                    console.error(response.data.msg);
                }
            })
            .catch(error => {
                console.error(error.response.data)
                this.setState({status: error.response.data})
            })
    }

    SetValueFromUserInput = (event) => {
        this.setState({[event.target.id]: event.target.value}, () => {
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
                if (Array.isArray(response.data["posts"])) {
                    this.setState({
                        Posts: response.data["posts"]
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

    searchCategory = (id) => {
        axios.get(API_URL + '/posts/category/get/' + id)
            .then(response => {
                console.log(response.data)
                if (Array.isArray(response.data["arr"])) {
                    this.setState({
                        Posts: response.data["arr"]
                    })
                } else {
                    console.error(response.data.msg);
                }
            })
            .catch(error => {
                console.error(error.response.data)
                this.setState({
                    Posts: []
                })
                this.setState({status: error.response.data})
            })
    }

    truncateText = (text, maxNum) => {
        if (text.length > maxNum) {
            return text.substring(0, maxNum) + '...'
        }
        return text
    }

    sort = () => {
        const sortedData = this.state.Posts.sort((a, b) =>
            this.state.isAscending
                ? new Date(b["created_at"]) - new Date(a["created_at"])
                : new Date(a["created_at"]) - new Date(b["created_at"]))
        this.setState({isAscending: !this.state.isAscending, Posts: sortedData})
    }


    render() {
        const data = this.state.Posts
        return (<div>

            <div className="row row-cols-1 row-cols-md-3 g-4" style={{margin: "10px"}}>
                <div className="w-100 d-flex justify-content-center">
                    <h3>Browse the content free of charge</h3>
                </div>

                <div className="input-group">
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic">
                            Search by Category
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => this.fetchAllPosts()}>Get all posts</Dropdown.Item>
                            {this.state.cat.length > 0 ? this.state.cat.map((t) => (
                                <Dropdown.Item key={t.id} onClick={() => this.searchCategory(t.id)}>
                                    {t.name}
                                </Dropdown.Item>)) : null}
                        </Dropdown.Menu>
                    </Dropdown>

                    <input id="payload" type="search" className="form-control rounded" placeholder="Search"
                           aria-label="Search" value={this.state.payload}
                           aria-describedby="search-addon" onChange={this.SetValueFromUserInput}/>

                    <button onClick={this.PerformSearchInDb} type="button" className="btn btn-outline-success"
                            data-mdb-ripple-init="">search
                    </button>
                    <button type="button" className="btn btn-outline-danger"
                            onClick={() => {
                                this.fetchAllPosts()
                                this.setState({payload: ""})
                            }}
                            data-mdb-ripple-init="">Remove all filters
                    </button>
                    <button
                        onClick={this.sort}
                        type="button"
                        className="btn btn-outline-primary"
                    >
                        sort
                        <span className="badge badge-dark">
                                {this.state.isAscending ? (<i className="bi bi-arrow-up text-primary"></i>) : (
                                    <i className="bi bi-arrow-down text-primary"></i>)}
                            </span>
                    </button>
                </div>


                {data.length > 0 ? data.map((d) => {
                    const date = new Date(d["created_at"])
                    const options = {year: 'numeric', month: '2-digit', day: '2-digit'}
                    const formattedDate = date.toLocaleDateString('en-GB', options) + ' @ ' + date.toLocaleTimeString()
                    return (<div className="col-md-4 mb-4" key={d.id}>
                        <div className="card h-100 d-flex flex-column">
                            <div className="card-body flex-grow-1 d-flex flex-column">
                                <h5 className="card-title">{this.truncateText(d.title, 25)}</h5>
                                <p className="card-text mb-2">{this.truncateText(d.body, 75)}</p>
                                <div className="mt-auto">
                                    <p className="card-text">
                                        Author: {d.name} {d.surname}<br/>
                                        Category: {d["category_name"]}<br/>
                                        Published: {formattedDate}</p>
                                </div>
                            </div>
                            <button onClick={() => this.props.changeState({CurrentPage: POST, id: d.id})}
                                    style={{margin: "10px"}} className="btn btn-primary bt">Read more
                            </button>
                        </div>
                    </div>)
                }) : "No posts found..."}
            </div>

        </div>)
    }

}

export default PostsView
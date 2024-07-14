import React from "react";
import axios from "axios";
import {API_URL} from "../Utils/Configuration";

class PostsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Posts: []
        }
    }

    componentDidMount() {
        axios.get(API_URL + '/posts', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log(response.data.arr)
                if (Array.isArray(response.data.arr)) {
                    this.setState({
                        Posts: response.data.arr
                    });
                    console.log(this.state.Posts)
                } else {
                    console.error(response.data.msg);
                }
            })
            .catch(error => {
                // Handle the error here
                console.error("---------- An error occurred while fetching posts ----------")
                console.log(error)
            });
    }


    render() {
        const data = this.state.Posts
        console.log(data)
        return (<div className="row row-cols-1 row-cols-md-3 g-4" style={{margin: "10px"}}>
            {data.length > 0 ? data.map((d) => {
                return (<div className="col" key={d.id}>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">{d.title}</h5>
                            <p className="card-text">{d.body}</p>
                        </div>
                    </div>
                </div>)
            }) : "error not loading da ti ebam pleme majcino da ti ebam klenceno..."}

        </div>)
    }
}

export default PostsView
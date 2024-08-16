import React from "react";
import axios from "axios";
import {API_URL} from "../Utils/Configuration";
import {POST} from "../Utils/Constants";

class TechNews extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            status: {
                success: null, msg: "", news: []
            },
        }
        this.req = axios.create({
            withCredentials: true, baseURL: API_URL, headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    componentDidMount() {
        this.req.get('/scraper/').then(response => {
            this.setState({status: response.data})
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        const data = this.state.status.news
        return (<div className="" style={{margin: "10px"}}>
            <div className="card-body">
                <div className="w-100 d-flex justify-content-center">
                    <h3>Stay up to date with the latest news from TechRadar</h3>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4" style={{margin: "10px"}}>
                    {data.length > 0 ? data.map((d, id) => {
                        return (<div className="col-md-4 mb-4" key={id}>
                            <div className="card h-100 d-flex flex-column">
                                {d.image && <img src={d.image} className="card-img-top" alt={d.title}/>}
                                <div className="card-body flex-grow-1 d-flex flex-column">
                                    <h5 className="card-title">{d.title}</h5>
                                    <p className="card-text mb-2">{d.summary}</p>
                                    <div className="mt-auto">
                                        <p className="card-text">
                                            Origin: {d.origin}<br/></p>
                                    </div>
                                </div>
                                <button onClick={() => window.open(d.link, '_blank')}
                                        style={{margin: "10px"}} className="btn btn-primary bt">Read more
                                </button>
                            </div>
                        </div>)
                    }) : "Loading data from API."}
                </div>
            </div>
        </div>)
    }
}

export default TechNews
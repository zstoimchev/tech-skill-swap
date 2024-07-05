import {Component} from "react";
import {ABOUT, HOME} from "./Utils/Constants"
import HomeView from "./CustomComponents/HomeView";
import AboutView from "./CustomComponents/AboutView";
// import axios from "axios";
// import { API_URL } from "./Utils/Configuration";
// import Cookies from 'universal-cookie';
// const cookies = new Cookies();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CurrentPage: HOME, Novica: 1, status: {
                success: null, msg: ""
            }, user: null
        };
    }

    QGetView(state) {
        const page = state.CurrentPage;
        switch (page) {
            case HOME:
              return <HomeView />;
            case ABOUT:
                return <AboutView />
            default:
              return <HomeView />;
        }
    };

    QSetView = (obj) => {
        this.setState(this.state.status = {success: null, msg: ""})
        console.log("QSetView");
        this.setState({
            CurrentPage: obj.page, Novica: obj.id || 0
        });
    };

    render() {
        return (<div id="APP" className="container">
            <div id="menu" className="row">


                <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
                    <div className="container-fluid">
                        <a
                            onClick={this.QSetView.bind(this, {page: "home"})}
                            className="navbar-brand"
                            href="#">
                            Tech Skill Swap
                        </a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarNavAltMarkup"
                            aria-controls="navbarNavAltMarkup"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div className="navbar-nav">
                                <a className="nav-item nav-link active"
                                   onClick={this.QSetView.bind(this, {page: HOME})} href="#">Home</a>
                                <a className="nav-item nav-link"
                                   onClick={this.QSetView.bind(this, {page: ABOUT})} href="#">About</a>
                                <a className="nav-item nav-link" href="#">Posts</a>
                                <a className="nav-item nav-link" href="#">Register</a>
                                <a className="nav-item nav-link" href="#">Login</a>
                            </div>
                        </div>
                    </div>
                </nav>
                {/*onClick={this.QSetView.bind(this, {page: ABOUT})}*/}


            </div>

            <div id="viewer" className="row container">
                {this.QGetView(this.state)}
            </div>
        </div>);
    }
}

export default App;
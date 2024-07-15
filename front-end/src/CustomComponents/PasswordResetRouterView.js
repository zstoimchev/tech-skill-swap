import { BrowserRouter as Router, Route } from 'react-router-dom';
import ResetPasswordView from './ResetPasswordView';

function PaswordResetRouter(props) {
    return (
        <Router>
            <Route path="/password/reset/:token" render={(routeProps) => <ResetPasswordView {...routeProps} {...props} />} />
        </Router>
    );
}

// In your App component's render method:
render() {
    return (
        <div id="APP" className="container">
            {/* Your existing code */}
            {this.state.CurrentPage === RESETPW && <PasswordResetRouter />}
        </div>
    );
}

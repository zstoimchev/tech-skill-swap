import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'

class QnaView extends React.Component {

    collapseAll = () => {
        const collapses = document.querySelectorAll('.collapse.show');
        collapses.forEach(collapse => {
            collapse.classList.remove('show');
        });
    }

    render() {
        return (<div className="card"
                     style={{margin: "10px"}}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title">Frequently Asked Questions (FAQ) / Questions & Answers (Q&A)</h4>
                    <button className="btn btn-outline-warning" onClick={this.collapseAll}>
                        Collapse All
                    </button>
                </div>

                <ol className="list-unstyled">
                    <li className="text-center m-3" style={{fontFamily: 'Arial, sans-serif', fontSize: '18px'}}>
                        <a data-bs-toggle="collapse" href={"#question1"} role="button" aria-expanded="false"
                           aria-controls="question1" style={{textDecoration: 'none', color: 'black'}}>
                            What is Tech Skill Swap?
                        </a>
                        <div className="collapse" id="question1">
                            <div className="card card-body">
                                Tech Skill Swap is a platform where users can post technical problems they are facing
                                and receive help from others who have the skills to solve those problems. It’s a
                                community-driven space for learning, sharing, and problem-solving.
                            </div>
                        </div>
                    </li>
                    <li className="text-center m-3" style={{fontFamily: 'Arial, sans-serif', fontSize: '18px'}}>
                        <a data-bs-toggle="collapse" href={"#question2"} role="button" aria-expanded="false"
                           aria-controls="question2" style={{textDecoration: 'none', color: 'black'}}>
                            How do I post a problem?
                        </a>
                        <div className="collapse" id="question2">
                            <div className="card card-body">
                                To post a problem, simply sign up or log in to your account, navigate to the “Post a
                                Problem” section, and fill out the form with the details of your issue. Once submitted,
                                your problem will be visible to the community.
                            </div>
                        </div>
                    </li>
                    <li className="text-center m-3" style={{fontFamily: 'Arial, sans-serif', fontSize: '18px'}}>
                        <a data-bs-toggle="collapse" href={"#question3"} role="button" aria-expanded="false"
                           aria-controls="question3" style={{textDecoration: 'none', color: 'black'}}>
                            Can I offer my skills to help others?
                        </a>
                        <div className="collapse" id="question3">
                            <div className="card card-body">
                                Absolutely! If you have expertise in a particular area and enjoy solving problems, you
                                can offer your help to others. You can choose to help for free or charge a small fee for
                                your services.
                            </div>
                        </div>
                    </li>
                    <li className="text-center m-3" style={{fontFamily: 'Arial, sans-serif', fontSize: '18px'}}>
                        <a data-bs-toggle="collapse" href={"#question4"} role="button" aria-expanded="false"
                           aria-controls="question4" style={{textDecoration: 'none', color: 'black'}}>
                            Is there a cost to join Tech Skill Swap?
                        </a>
                        <div className="collapse" id="question4">
                            <div className="card card-body">
                                No, joining Tech Skill Swap is completely free. You can sign up, post problems, and
                                offer your skills without any cost.
                            </div>
                        </div>
                    </li>
                    <li className="text-center m-3" style={{fontFamily: 'Arial, sans-serif', fontSize: '18px'}}>
                        <a data-bs-toggle="collapse" href={"#question5"} role="button" aria-expanded="false"
                           aria-controls="question5" style={{textDecoration: 'none', color: 'black'}}>
                            How do I earn money on Tech Skill Swap?
                        </a>
                        <div className="collapse" id="question5">
                            <div className="card card-body">
                                If you choose to offer your help for a fee, you can set your own rates. When someone
                                accepts your offer, you will be paid through our secure payment system.
                            </div>
                        </div>
                    </li>
                    <li className="text-center m-3" style={{fontFamily: 'Arial, sans-serif', fontSize: '18px'}}>
                        <a data-bs-toggle="collapse" href={"#question6"} role="button" aria-expanded="false"
                           aria-controls="question6" style={{textDecoration: 'none', color: 'black'}}>
                            What types of problems can I post?
                        </a>
                        <div className="collapse" id="question6">
                            <div className="card card-body">
                                You can post any technical problem, whether it’s related to coding, hardware issues,
                                software bugs, or even conceptual difficulties. No problem is too big or too small!
                            </div>
                        </div>
                    </li>
                    <li className="text-center m-3" style={{fontFamily: 'Arial, sans-serif', fontSize: '18px'}}>
                        <a data-bs-toggle="collapse" href={"#question7"} role="button" aria-expanded="false"
                           aria-controls="question7" style={{textDecoration: 'none', color: 'black'}}>
                            How do I know if someone can help me with my problem?
                        </a>
                        <div className="collapse" id="question7">
                            <div className="card card-body">
                                Once you post your problem, it will be visible to the community. Users with the relevant
                                skills can then offer their help. You can review their profiles and ratings before
                                accepting their assistance.

                            </div>
                        </div>
                    </li>
                    <li className="text-center m-3" style={{fontFamily: 'Arial, sans-serif', fontSize: '18px'}}>
                        <a data-bs-toggle="collapse" href={"#question8"} role="button" aria-expanded="false"
                           aria-controls="question8" style={{textDecoration: 'none', color: 'black'}}>
                            How do I contact someone who can help me?
                        </a>
                        <div className="collapse" id="question8">
                            <div className="card card-body">
                                When someone offers to help with your problem, you can communicate with them through our
                                platform’s messaging system to discuss the details and arrange the assistance.
                            </div>
                        </div>
                    </li>
                    <li className="text-center m-3" style={{fontFamily: 'Arial, sans-serif', fontSize: '18px'}}>
                        <a data-bs-toggle="collapse" href={"#question9"} role="button" aria-expanded="false"
                           aria-controls="question9" style={{textDecoration: 'none', color: 'black'}}>
                            Is my personal information safe on Tech Skill Swap?
                        </a>
                        <div className="collapse" id="question9">
                            <div className="card card-body">
                                Yes, we take your privacy seriously. Your personal information is protected and will not
                                be shared with third parties without your consent.
                            </div>
                        </div>
                    </li>
                    <li className="text-center m-3" style={{fontFamily: 'Arial, sans-serif', fontSize: '18px'}}>
                        <a data-bs-toggle="collapse" href={"#question10"} role="button" aria-expanded="false"
                           aria-controls="question10" style={{textDecoration: 'none', color: 'black'}}>
                            What if I’m not satisfied with the help I receive?
                        </a>
                        <div className="collapse" id="question10">
                            <div className="card card-body">
                                If you’re not satisfied with the assistance you receive, you can leave a review and
                                rating for the helper. We also have a support team to address any issues or disputes
                                that may arise.
                            </div>
                        </div>
                    </li>
                </ol>


            </div>
        </div>)
    }
}

export default QnaView
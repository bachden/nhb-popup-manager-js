import React from "react"
import ReactDOM from "react-dom"
import PopupManager from "../main"
import css from "./test.css"

var popupIndex = 0;
var prevPopupId = undefined;

class MyPopup extends React.Component {

    componentDidMount() {
        this.props.zoomPopup(1.5)
    }

    render() {
        return (<div className="test-content" onMouseDown={(event) => {
                console.log("start dragging")
                this.props.startDragging(event)
            }}>
            <p>This is popup: {this.props.popupId}</p>
            <button onClick={openPopup}>Force close and open another</button>
        </div>)
    }
}

function openPopup() {
    var openNewPopup = () => {
        prevPopupId = PopupManager.open({
            title: "Test popup", className: ["test-popup"], autoClose: true, // if modalEnabled == true, auto close on modal clicked
            closeBtn: {
                // all properties here will be forwarded to close button
                className: ["test-close-btn"],
                style: {
                    color: "red"
                }
            },
            draggable: true,
            customDraggingHandler: true,
            keepDraggingByHeader: true,
            // styling for popup wrapper tag
            style: {
                position: "absolute"
            },
            modal: {
                style: {
                    position: "fixed",
                    left: "0px",
                    right: "0px",
                    top: "0px",
                    bottom: "0px",
                    backgroundColor: "rgba(0,0,0,0.5)"
                }
            },
            onPopupWillClose: (popupId, type) => {
                console.log("Popup " + popupId + " by type: " + type)
                return confirm("You're attempting to close popup " + (
                    type == "normal"
                    ? "by normal way"
                    : "by click on outside") + ".\nAre you sure you want to close popup id " + popupId + "?"); // true to continue close propagation, false to prevent popup closing
            },
            onPopupDidClose: (popupId) => {
                // method called everytime popup closed
                console.log("popup closed: id=" + popupId)
                prevPopupId = undefined
            },
            content: MyPopup
        }, (popupId) => {
            prevPopupId = popupId
            console.log("new popup opened: id=" + popupId)
        })
    }
    if (prevPopupId != undefined) {
        PopupManager.close(prevPopupId, openNewPopup, true)
    } else {
        openNewPopup()
    }
}

ReactDOM.render((<div>
    <button onClick={openPopup}>Open popup</button>
    <PopupManager/>
</div>), document.getElementById("application-root"))
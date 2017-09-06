import React from "react"
import ReactDOM from "react-dom"
import PopupManager from "../main"
import css from "./test.css"

var popupIndex = 0;
var prevPopupId = undefined;

function openPopup() {
    var openNewPopup = () => {
        prevPopupId = PopupManager.open({
            title: "Popup " + (popupIndex++),
            className: ["test-popup"],
            autoClose: true, // if modalEnabled == true, auto close on modal clicked
            closeBtn: {
                // all properties here will be forwarded to close button
                className: ["test-close-btn"],
                style: {
                    color: "red"
                }
            },
            // styling for popup wrapper tag
            style: {},
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
            onPopupWillClose: () => {
                return confirm("Are you sure?"); // true to continue close propagation, false to prevent popup closing
            },
            onPopupDidClose: (popupId) => {
                // method called everytime popup closed
                console.log("popup closed: id=" + popupId)
                prevPopupId = undefined
            },
            content: (
                <div className="test-content">
                    <p>This is popup content</p>
                    <button onClick={openPopup}>Close and open another</button>
                </div>
            )
        }, (popupId) => {
            prevPopupId = popupId
            console.log("new popup opened: id=" + popupId)
        })
    }
    if (prevPopupId != undefined) {
        PopupManager.close(prevPopupId, openNewPopup)
    } else {
        openNewPopup()
    }
}

ReactDOM.render((
    <div>
        <button onClick={openPopup}>Open popup</button>
        <PopupManager/>
    </div>
), document.getElementById("application-root"))

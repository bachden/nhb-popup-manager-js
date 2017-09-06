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
                className: ["test-close-btn"],
                onClick: () => {
                    // return true; // true to prevent auto close, otherwise, if autoClose == true, popup will be closed
                }
            },
            // styling for popup wrapper tag
            style: {},
            modalEnabled: true,
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
            onClosed: (popupId) => {
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

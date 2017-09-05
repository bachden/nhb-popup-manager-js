import React from "react"
import ReactDOM from "react-dom"
import PopupManager from "../main"

var popupIndex = 0;
var prevPopupId = undefined;

function openPopup() {
    var openNewPopup = () => {
        prevPopupId = PopupManager.open({
            title: "Test popup " + (popupIndex++),
            autoClose: true,
            closeBtn: {
                className: ["test-close-btn"],
                onClick: () => {
                    // return true; // true to prevent auto close, otherwise, if autoClose == true, popup will be closed
                }
            },
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
                <div>
                    <div>This is popup content</div>
                    <button onClick={openPopup}>Add more</button>
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

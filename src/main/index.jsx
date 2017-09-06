import React from "react"
import css from "./popup-manager.css"

const DEFAULT_INSTANCE_NAME = "_default_"
let instances = {}
let idSeed = 0;
let popupIdToManagerInstance = {}

export default class PopupManager extends React.Component {

    constructor(props) {
        super(props)
        var name = props.name
        if (!name) {
            name = DEFAULT_INSTANCE_NAME
        }
        if (instances[name]) {
            throw "Cannot create PopuManager instance with name " + name + " which already exists"
        }
        instances[name] = this
        this.state = {
            popups: {}
        }
    }

    static getInstance(name) {
        return instances[name]
    }

    static getDefaultInstance() {
        return PopupManager.getInstance(DEFAULT_INSTANCE_NAME)
    }

    static open() {
        var popup = undefined
        var manager = PopupManager.getDefaultInstance();
        var callback = undefined;

        if (arguments.length == 0) {
            throw "Invalid popup info"
        } else if (arguments.length == 1) {
            if (!(typeof arguments[0] === "object")) {
                throw "Invalid popup info, expected for object, got " + (typeof arguments[0])
            } else {
                popup = arguments[0]
            }
        } else if (arguments.length == 2) {
            //
            var arg1 = arguments[0]
            var arg2 = arguments[1]
            if (typeof arg1 === "string" && typeof arg2 == "object") {
                popup = arg2
                manager = PopupManager.getInstance(arg1)
            } else if (typeof arg1 === "object" && typeof arg2 == "string") {
                popup = arg1
                manager = PopupManager.getInstance(arg2)
            } else if (typeof arg1 == "object" && typeof arg2 == "function") {
                popup = arg1
                callback = arg2
            }
        } else if (arguments.length == 3) {
            var arg1 = arguments[0]
            var arg2 = arguments[1]
            var arg3 = arguments[3]
            if (typeof arg1 === "string" && typeof arg2 == "object") {
                popup = arg2
                manager = PopupManager.getInstance(arg1)
            } else if (typeof arg1 === "object" && typeof arg2 == "string") {
                popup = arg1
                manager = PopupManager.getInstance(arg2)
            }
            callback = arg3
            if (typeof callback != "function") {
                throw "Invalid callback"
            }
        }

        if (!popup) {
            throw "Invalid popup info"
        } else if (!manager) {
            throw "Invalid popupManager"
        }

        var popups = Object.assign({}, manager.state.popups)
        popup.key = popup.id = idSeed++;
        popups[popup.id] = popup
        manager.setState({
            popups
        }, () => {
            if (typeof callback == "function") {
                callback(popup.id)
            }
            popupIdToManagerInstance[popup.id + ""] = manager
        })
        return popup.id
    }

    static close(popupId, callback, force = false) {
        if (callback && typeof callback != "function") {
            throw "Callback must be function"
        }
        popupId = popupId + ""
        var manager = popupIdToManagerInstance[popupId]
        if (manager) {
            var popups = Object.assign({}, manager.state.popups);
            var popup = popups[popupId];
            if (popup) {
                var continueClosing = true;
                if (force === false) {
                    if (typeof popup.onPopupWillClose == "function") {
                        continueClosing = popup.onPopupWillClose(popupId)
                    }
                }
                if (continueClosing) {
                    delete popups[popupId];
                    manager.setState({
                        popups: popups
                    }, () => {
                        if (typeof popup.onPopupDidClose == "function") {
                            popup.onPopupDidClose(popup.id)
                        }
                        if (typeof callback == "function") {
                            callback()
                        }
                    })
                }
            }
        }
    }

    render() {
        return (
            <div className="popup-manager">
                {(() => {
                    var list = [];
                    for (var id in this.state.popups) {
                        ((popup) => {
                            var classes = ["popup"]
                            if (popup.className) {
                                if (typeof popup.className == "string") {
                                    classes.push(popup.className)
                                } else if (typeof popup.className == "object" && popup.className instanceof Array) {
                                    classes = classes.concat(popup.className)
                                }
                            }
                            var closeBtn = popup.closeBtn
                                ? {
                                    ...popup.closeBtn
                                }
                                : undefined
                            var closeBtnClasses = ["popup-close-button"]
                            if (closeBtn) {
                                var className = closeBtn.className;
                                if (className) {
                                    if (typeof popup.closeBtn.className == "string") {
                                        closeBtnClasses.push(popup.closeBtn.className)
                                    } else if (popup.closeBtn.className instanceof Array) {
                                        closeBtnClasses = closeBtnClasses.concat(popup.closeBtn.className)
                                    }
                                    delete closeBtn.className
                                }
                            }

                            var onClose = (e) => {
                                if (popup.autoClose) {
                                    PopupManager.close(popup.id, undefined)
                                }
                            }

                            var popupDisplayer = (
                                <div className={classes.join(" ")} style={popup.style}>
                                    <div className="popup-header">
                                        <div className="popup-title">{popup.title}</div>
                                        <div {...closeBtn} className={closeBtnClasses.join(" ")} onClick={onClose}/>
                                    </div>
                                    <div className="popup-content">
                                        {popup.content}
                                    </div>
                                </div>
                            )
                            list.push(popup.modal
                                ? (
                                    <div key={popup.key} className="popup-holder">
                                        <div className="popup-modal" {...popup.modal} onClick={onClose}></div>
                                        {popupDisplayer}
                                    </div>
                                )
                                : (
                                    <div key={popup.key} className="popup-holder">{popupDisplayer}</div>
                                ))
                        })(this.state.popups[id])
                    }
                    return list
                })()}
            </div>
        )
    }
}

module.exports = PopupManager

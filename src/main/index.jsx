import React from "react"
import css from "./popup-manager.css"

const PopupManager = (() => {
    //

    var DEFAULT_INSTANCE_NAME = "_default_"
    var instances = {}
    var idSeed = 0;
    var popupIdToManagerInstance = {}

    class _PopupManager extends React.Component {

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
            return _PopupManager.getInstance(DEFAULT_INSTANCE_NAME)
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

        static close(popupId, callback) {
            var manager = popupIdToManagerInstance[popupId + ""]
            if (manager) {
                var popups = Object.assign({}, manager.state.popups);
                var popup = popups[popupId + ""];
                delete popups[popupId + ""];
                manager.setState({
                    popups: popups
                }, () => {
                    if (callback) {
                        callback()
                    }
                    if (typeof popup.onClosed == "function") {
                        popup.onClosed(popup.id)
                    }
                })
            }
        }

        render() {
            return (
                <div className="popup-manager">
                    {(() => {
                        var list = []
                        for (var id in this.state.popups) {
                            var popup = this.state.popups[id]
                            var classes = ["popup"]
                            if (popup.className) {
                                if (typeof popup.className == "string") {
                                    classes.push(popup.className)
                                } else if (typeof popup.className == "object" && popup.className instanceof Array) {
                                    classes = classes.concat(popup.className)
                                }
                            }
                            var closeBtnClasses = ["popup-close-button"]
                            if (popup.closeBtn && popup.closeBtn.className) {
                                if (typeof popup.closeBtn.className == "string") {
                                    closeBtnClasses.push(popup.closeBtn.className)
                                } else if (typeof popup.closeBtn.className == "object" && popup.closeBtn.className instanceof Array) {
                                    closeBtnClasses = classes.concat(popup.closeBtn.className)
                                }
                            }

                            var onClose = (e) => {
                                var callback = popup.closeBtn && popup.closeBtn.onClick
                                callback = callback
                                    ? popup.closeBtn.onClick
                                    : undefined;
                                var preventClose = false;
                                if (callback) {
                                    preventClose = callback(e, popup.id)
                                }
                                if (!preventClose && popup.autoClose) {
                                    PopupManager.close(popup.id)
                                }
                            }

                            var popupDisplayer = (
                                <div className={classes.join(" ")}>
                                    <div className="popup-header">
                                        <div className="popup-title">{popup.title}</div>
                                        <div className={closeBtnClasses.join(" ")} onClick={onClose}/>
                                    </div>
                                    <div className="popup-content">
                                        {popup.content}
                                    </div>
                                </div>
                            )
                            list.push((popup.modalEnabled && popup.modal)
                                ? (
                                    <div key={popup.key} className="popup-holder">
                                        <div className="popup-modal" {...popup.modal} onClick={(e) => {
                                            if (popup.autoClose) {
                                                PopupManager.close(popup.id)
                                            }
                                        }}/> {popupDisplayer}
                                    </div>
                                )
                                : (
                                    <div key={popup.key} className="popup-holder">{popupDisplayer}</div>
                                ))
                        }
                        return list
                    })()}
                </div>
            )
        }
    }

    return _PopupManager
})();

export default PopupManager

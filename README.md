# installation
``` shell
npm i nhb-popup-manager
```

# usage
1. add a PopupManager component to where you want to render popups: <br/>
``` javascript
import PopupManager from "nhb-popup-manager"
ReactDOM.render((
    <div>
        <PopupManager/>
    </div>
), document.getElementById("application-root"))
```

or for multi manager:
``` javascript
import PopupManager from "nhb-popup-manager"
ReactDOM.render((
    <div>
        <PopupManager name="popup-manager-name"/>
    </div>
), document.getElementById("application-root"))
```
popup-manager-name will be used to open popup to

2. import PopupManager to open popup <br/>
``` javascript
import PopupManager from "nhb-popup-manager"
var popupId = PopupManager.open({
    title: "Popup title...",
    content: <div>JSX tag for content displayer</div>
    })
```
above method will render popup on default instance (with no name attr) <br/>
to render popup to specific popup manager:
``` javascript
import PopupManager from "nhb-popup-manager"
var popupId = PopupManager.open({
    title: "Popup title...",
    content: <div>JSX tag for content displayer</div>
}, "popup-manager-name")
```

3. close popup anywhere, just need to know popupId (return by open method)<br/>
``` javascript
PopupManager.close(popupId)
```

4. callback
PopupManager provide 2 common methods: open and close. In deep, both method modify internal state of a PopupManager instance, so, to do many action like: close a popup then open new one, you may want to add callback:
``` javascript
PopupManager.open({...popupConfig}, callback)
```
or
``` javascript
PopupManager.close(popupId, callback)
```

callback method will be called right after PopupManager instance update its state, argument passed is popupId

# Popup config
below is simple popup config:
``` javascript
{
    title: "Test popup",
    autoClose: true, // if modalEnabled == true, auto close on modal or close btn clicked
    closeBtn: {
        className: ["test-close-btn"],
        onClick: () => {
            // return true; // true to prevent auto close (if it == true), otherwise, if autoClose == true, popup will be closed
        }
    },
    // styling for popup wrapper tag
    style: {
        marginTop: "10px"
    },
    modalEnabled: true, // enable modal, but may not effect if modal not specified
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
    },
    content: (
        <div>
            <div>This is popup content</div>
            <button onClick={openPopup}>Add more</button>
        </div>
    )
}
```

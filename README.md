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
to render popup to specific popup manager: <br/>
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

4. callback <br/>
PopupManager provide 2 common methods: open and close.  <br/>
In deep, both method modify internal state of a PopupManager instance,  <br/>
so, to do many action like: close a popup then open new one, you may want to add callback: <br/>
``` javascript
PopupManager.open({...popupConfig}, callback)
```
or
``` javascript
PopupManager.close(popupId, callback)
```

callback method will be called right after PopupManager instance update its state, argument passed is popupId

5. closing behaviours <br/>
there are 2 methods:
``` javascript
onPopupWillClose(popupId, type)
```
called before popup close. If this method return false, closing propagation will be stopped  <br/>
if popup closed by user click on modal (autoClose == true), type == 'modal', otherwise, type == 'normal'

``` javascript
onPopupDidClose(popupId)
```
called after popup closed

# Popup config
below is simple popup config:
``` javascript
{
    title: "Popup title",
    className: ["test-popup"],
    autoClose: true, // auto close on modal or close button clicked
    draggable: true, // default false, true to enable popup dragging
    customDraggingHandler: true, // default false, use for custom dragging handler,
    keepDraggingByHeader: true, // if customDraggingHandler == true but still want to drag by popup header
    closeBtn: {
        // all properties here will be forwarded to close button, except onClick
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
    onPopupWillClose: (popupId, type) => {
        console.log("Popup " + popupId + " by type: " + type)
        return confirm("Are you sure you want to close popup id " + popupId + "?"); // true to continue close propagation, false to prevent popup closing
    },
    onPopupDidClose: (popupId) => {
        // method called everytime popup closed
        console.log("popup closed: id=" + popupId)
    },
    // content can be react element, or class, or [class, props] array, or {type: class, props} object
    // if content is valid and not a react element, its props will has "popupId"
    // if (draggable && customDraggingHandler) == true, content's props will has "startDragging(event)" method injected
    content: (
        <div className="test-content">
            <p>This is popup content</p>
        </div>
    )
}
```

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
above method will render popup on default instance (with no name attr)
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

callback method will be called right after PopupManager instance update its state with ```popupId````

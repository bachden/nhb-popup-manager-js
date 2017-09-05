# installation
npm i nhb-popup-manager

# usage
1. add a PopupManager component to where you want to render popups:
ReactDOM.render((
    <div>
        <PopupManager/>
    </div>
), document.getElementById("application-root"))

2. import PopupManager to open popup
import PopupManager from "nhb-popup-manager"

var popupId = PopupManager.open({
    title: "Popup title...",
    content: <div>JSX tag for content displayer</div>
    })

3. close popup anywhere, just need to know popupId (return by open method)
PopupManager.close(popupId)

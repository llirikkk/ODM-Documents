const uri = window.location.href;
let queryString = {};

// Getting currentTabId from uri
uri.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function($0, $1, $2, $3) { queryString[$1] = $3; }
    );
let currentTabId = queryString["tab"] || "under-my-approval";
let currentTab = document.getElementById(currentTabId) || document.getElementById("under-my-approval");
currentTab.classList.remove("tab-content_hide");

let currentTabAnchor = document.querySelector(`a[href="#${currentTab.id}"]`);
currentTabAnchor.parentNode.classList.add("tab-links__item_active");

// Adding handlers to tab anchors
const tabAnchors = document.querySelectorAll(".tab-links a");
for (let i = 0, len = tabAnchors.length; i < len; i++){
    tabAnchors[i].addEventListener("click", tabHandler);
}

function tabHandler(event) {
    const tabId = event.target.hash.slice(1);
    event.preventDefault();
    history.replaceState("", "", `?tab=${tabId}`);
    if (currentTab.id != tabId){
        currentTabAnchor.parentNode.classList.remove("tab-links__item_active");
        currentTab.classList.add("tab-content_hide");
        currentTab = document.getElementById(tabId);
        currentTabAnchor = event.target;
        currentTabAnchor.parentNode.classList.add("tab-links__item_active");
        currentTab.classList.remove("tab-content_hide");

        // If current tab hadn't been loaded, load tab content
        if (!currentTab.getAttribute("loaded")) {
            loadTabContent(currentTab.id);
        }
        currentTab.setAttribute("loaded", "true");
    }
}

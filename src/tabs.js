const uri = window.location.href;
let queryString = {};
uri.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function($0, $1, $2, $3) { queryString[$1] = $3; }
    );
let currentTabId = queryString["tab"] || "under-my-approval";
let currentTab = document.getElementById(currentTabId) || document.getElementById("under-my-approval");
currentTab.classList.remove("tab-content_hide");

const tabAnchors = document.querySelectorAll(".tab-links a");
for (let i = 0, len = tabAnchors.length; i < len; i++){
    tabAnchors[i].addEventListener("click", tabHandler);
}

function tabHandler(event) {
    event.preventDefault();
    history.replaceState("", "", "?tab=" + event.target.hash.slice(1));
}

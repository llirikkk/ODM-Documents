function loadTabContent(tabId) {
    const tab = document.getElementById(tabId);
    let tableName = `${tabId}-inc`;
    let xhr = new XMLHttpRequest();

    xhr.open("GET", `./src/${tableName}.json`, true);
    xhr.onload = function() {
        const xhrData = JSON.parse(xhr.responseText);
        renderHTML(xhrData);
    };
    xhr.send();

    function renderHTML(tableData) {
        const table = document.createElement("table");
        const tHead = document.createElement("thead");
        const tBody = document.createElement("tbody");
        const tHeadTr = document.createElement("tr");

        // Index of table Execution marks
        let markIndex;

        let thArray = tableData["tHead"];
        let tBodyArray = tableData["tBody"];

        for (let i = 0, len = thArray.length; i < len; i++) {
            let th = document.createElement("th");
            th.innerHTML = thArray[i];
            tHeadTr.appendChild(th);
            if (thArray[i].toLowerCase() === "execution mark") {
                markIndex = i;
            }
        }
        for (let i = 0, len = tBodyArray.length; i < len; i++) {
            let tr = document.createElement("tr");

            for (let j = 0, len = tBodyArray[i].length; j < len; j++) {
                let td = document.createElement("td");

                // Applying styles to Execution Marks
                if (j === markIndex) {
                    const mark = tBodyArray[i][j];
                    let span = document.createElement("span");

                    switch(mark.toLowerCase()) {
                        case "signed":
                            span.classList.add("table-mark", "table-mark_signed");
                            break;
                        case "awaits":
                            span.classList.add("table-mark", "table-mark_awaits");
                            break;
                        case "cancelled":
                            span.classList.add("table-mark", "table-mark_cancelled");
                            break;
                    }
                    span.innerHTML = mark;
                    td.appendChild(span);
                } else {
                    td.innerHTML = tBodyArray[i][j];
                }
                tr.appendChild(td);
            }
            tBody.appendChild(tr);
        }

        table.id = `${tableName}__table`;
        tHead.appendChild(tHeadTr);
        table.appendChild(tHead);
        table.appendChild(tBody);

        tab.appendChild(table);
        console.log(markIndex);

        // Init sort
        initSort(table.id);
    }
}

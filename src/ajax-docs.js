function loadTabContent(tabId) {
    const tab = document.getElementById(tabId);
    const tabTables = [`${tabId}-inc`, `${tabId}-out`];
    let tableName;
    for (let i = 0, len = tabTables.length; i < len; i++) {
        tableName = tabTables[i];
        getTable(tableName);
    }

    function getTable(tableName) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `./src/${tableName}.json`, true);
        xhr.onload = function() {
            const xhrData = JSON.parse(xhr.responseText);

            /* AJAX request is asynchronous and because of it we must
            * pass tableName to renderHTML() as a parameter, in order to save it
            * in a closure of onload-callback*/
            renderHTML(xhrData, tableName);
        };
        xhr.send();
    }

    function renderHTML(tableData, tableName) {
        const table = document.createElement("table");
        const tHead = document.createElement("thead");
        const tBody = document.createElement("tbody");
        const tHeadTr = document.createElement("tr");
        const heading = document.createElement("h1");

        // Initializing table heading
        heading.textContent = tableData["heading"];

        // Index of table Execution marks
        let markIndex;

        let thArray = tableData["tHead"];
        let tBodyArray = tableData["tBody"];

        // Forming tHead
        for (let i = 0, len = thArray.length; i < len; i++) {
            let th = document.createElement("th");
            th.innerHTML = thArray[i];
            tHeadTr.appendChild(th);

            const el = thArray[i].toLowerCase();
            if (el === "execution mark" || el === "status") {
                markIndex = i;
            }
        }

        // Forming tBody
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
                        case "approved":
                            span.classList.add("table-mark", "table-mark_approved");
                            break;
                        case "held":
                            span.classList.add("table-mark", "table-mark_held");
                            break;
                        case "changed":
                            span.classList.add("table-mark", "table-mark_changed");
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

        // Adding table with heading to the tab
        table.id = `${tableName}__table`;
        tHead.appendChild(tHeadTr);
        table.appendChild(tHead);
        table.appendChild(tBody);

        // Adding heading to the table
        tab.appendChild(heading);
        tab.appendChild(table);
        console.log(markIndex);

        // Init sort
        initSort(table.id);
    }
}

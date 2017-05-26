function loadTabContent(tabId) {
    const tab = document.getElementById(tabId);

    // List of tables to be loaded
    const tabTables = [`${tabId}-inc`, `${tabId}-out`];

    // Array of loaded tables
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

        // Array of documents
        let docsArray = tableData["documents"];

        // List of document properties
        let docProps = [];

        // First document, needed to get properties
        const firstDoc = docsArray[0];

        // Index of table mark
        let markIndex;

        // Getting document properties and
        // Forming tHead
        for (let i = 0, len = firstDoc.length; i < len; i++) {
            const docProp = Object.keys(firstDoc[i])[0].toLowerCase();
            docProps[i] = docProp;
            let th = document.createElement("th");
            th.textContent = docProp;
            tHeadTr.appendChild(th);

            // Finding index of table mark
            if (docProp === "execution mark" || docProp === "status") {
                        markIndex = i;
                    }
        }

        // Forming tBody
        for (let i = 0, len = docsArray.length; i < len; i++) {
            let tr = document.createElement("tr");

            for (let j = 0, len = docsArray[i].length; j < len; j++) {
                const td = document.createElement("td");
                const docProp = docsArray[i][j][docProps[j]];

                // Applying styles to table marks
                if (j === markIndex) {
                    let span = document.createElement("span");
                    switch(docProp.toLowerCase()) {
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
                        case "deleted":
                            span.classList.add("table-mark", "table-mark_deleted");
                    }
                    span.innerHTML = docProp;
                    td.appendChild(span);
                } else {
                    td.textContent = docProp;
                }
                tr.appendChild(td)
            }
            tBody.appendChild(tr);
        }
        console.log(tBody);

        // Adding table with heading to the tab
        table.id = `${tableName}__table`;
        tHead.appendChild(tHeadTr);
        table.appendChild(tHead);
        table.appendChild(tBody);

        // Adding heading to the table
        tab.appendChild(heading);
        tab.appendChild(table);

        // Init sort
        initSort(table.id);
    }
}

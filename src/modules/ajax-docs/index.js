/*Tables in a tab are displayed in the order, that they are placed
 in the tabTables array. But here we make multiple asynchronous requests,
 which may respond not in the same order, that they were made.
 To resolve this we create section tags (with ids) for each table in the needed order*/

import initSort from "../tablesort";

export default function loadTabContent(tabId) {
    const tab = document.getElementById(tabId);

    // List of tables to be loaded
    const tabTables = [`${tabId}-inc`, `${tabId}-out`, `${tabId}-fax`];

    // Array of loaded tables
    let tableName;
    for (let i = 0, len = tabTables.length; i < len; i++) {
        tableName = tabTables[i];

        // Creating a section for each table
        const section = document.createElement("section");
        section.id = `${tableName}__container`;

        // Adding class for proper display on smartphones
        section.classList.add(`${tableName.slice(-3)}-documents`);
        tab.appendChild(section);

        // Making AJAX request for each table and add table to appropriate section
        getTable(tableName, section);
    }

    function getTable(tableName, section) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `../json/${tableName}.json`, true);
        xhr.onload = function() {
            const xhrData = JSON.parse(xhr.responseText);

            /* AJAX request is asynchronous and because of it we must
            * pass tableName to renderHTML() as a parameter, in order to save it
            * in a closure of onload-callback*/
            // setTimeout(renderHTML, 1000 * (Math.floor(Math.random() * 4) + 1), xhrData, tableName, section);
            renderHTML(xhrData, tableName, section);
        };
        xhr.send();
    }

    function renderHTML(tableData, tableName, section) {
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

                // Adding headings, visible only at the breakpoint, when tables are turned to cards
                let heading = document.createElement("span");
                heading.classList.add("doc-heading");
                heading.textContent = docProps[j];
                td.appendChild(heading);

                // Receiving document properties
                const docProp = docsArray[i][j][docProps[j]];

                // Applying styles to table marks
                if (j === markIndex) {
                    let span = document.createElement("span");
                    span.classList.add("table-mark",`table-mark_${docProp.toLowerCase()}`);
                    span.innerHTML = docProp;
                    td.appendChild(span);
                } else {
                    td.innerHTML += docProp;
                }
                tr.appendChild(td)
            }
            tBody.appendChild(tr);
        }

        // Adding table with heading to the tab
        table.id = `${tableName}__table`;
        tHead.appendChild(tHeadTr);
        table.appendChild(tHead);
        table.appendChild(tBody);

        // Adding heading to the table
        section.appendChild(heading);
        section.appendChild(table);

        // Init sort
        initSort(table.id);
    }
}

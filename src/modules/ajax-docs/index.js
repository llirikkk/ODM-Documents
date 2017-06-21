/*Tables in a tab are displayed in the order, that they are placed
 in the tabTables array. But here we make multiple asynchronous requests,
 which may respond not in the same order, that they were made.
 To resolve this we create section tags (with ids) for each table in the needed order*/

import initSort from "../tablesort";

export default function loadTabContent(tabId) {
    const tab = document.getElementById(tabId);

    // List of tables to be loaded
    const tabTables = [`${tabId}-inc`, `${tabId}-out`, `${tabId}-fax`];

    for (let i = 0, len = tabTables.length; i < len; i++) {
        let tableName = tabTables[i];

        // Creating a section for each table
        const tableSection = document.createElement("section");
        tableSection.id = `${tableName}__container`;
        
        tab.appendChild(tableSection);
        tableSection.innerHTML = `Loading ${tableName}...`;

        // Making AJAX request for each table and add table to appropriate section
        getTable(tableName, tableSection);
    }

    function getTable(tableName, section) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `../json/${tableName}.json`);
        xhr.onload = function() {
            if (xhr.status === 200) {
                const tableData = JSON.parse(xhr.responseText);

                /* AJAX request is asynchronous and because of it we must
                 * pass tableName to renderHTML() as a parameter, taken from a closure of onload-callback*/
                // Time delay for testing
                setTimeout(renderHTML, 1000 * (Math.floor(Math.random() * 4) + 1), tableData, tableName, section);
                // renderHTML(tableData, tableName, section);
            } else {
                section.innerHTML = `Couldn't load ${tableName}`;
            }
        };
        xhr.send();
    }

    function renderHTML(tableData, tableName, tableSection) {
        const table = document.createElement("table");
        const tHead = document.createElement("thead");
        const tBody = document.createElement("tbody");
        const tHeadTr = document.createElement("tr");
        const heading = document.createElement("h1");

        // Initializing table heading
        heading.textContent = tableData["heading"];

        // Array of documents
        const docsArray = tableData["documents"];

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
            const th = document.createElement("th");
            th.textContent = docProp;
            tHeadTr.appendChild(th);

            // Finding index of table mark
            if (docProp === "execution mark" || docProp === "status") {
                        markIndex = i;
                    }
        }

        // Forming tBody
        for (let i = 0, len = docsArray.length; i < len; i++) {
            const tr = document.createElement("tr");

            for (let j = 0, len = docsArray[i].length; j < len; j++) {
                const td = document.createElement("td");

                // Adding headings, visible only at the breakpoint, when tables are turned to cards
                const cardViewHeading = document.createElement("span");
                cardViewHeading.classList.add("doc-heading");
                cardViewHeading.textContent = docProps[j];
                td.appendChild(cardViewHeading);

                // Receiving document properties
                const docProp = docsArray[i][j][docProps[j]];

                // Applying styles to table marks
                if (j === markIndex) {
                    const tableMarkSpan = document.createElement("span");
                    tableMarkSpan.classList.add("table-mark",`table-mark_${docProp.toLowerCase()}`);
                    tableMarkSpan.innerHTML = docProp;
                    td.appendChild(tableMarkSpan);
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
        tableSection.innerHTML = "";
        tableSection.appendChild(heading);
        tableSection.appendChild(table);

        // Init sort
        initSort(table.id);
    }
}

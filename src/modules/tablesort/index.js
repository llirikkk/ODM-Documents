export default function initSort(...tableIDs) {
    for (let i = 0, len = tableIDs.length; i < len; i++) {
        const table = document.getElementById(tableIDs[i]);
        const tBody = table.tBodies[0];

        // The array of table rows to be sorted
        const rowArray = Array.prototype.slice.call(tBody.rows);

        // Table headings
        const tr = table.tHead.rows[0];

        // Current heading
        let target;

        // Direction of sort
        let reverse = -1;

        tr.addEventListener("click", sortTable, false);

        function sortTable(event) {
            if (target != event.target || !target) {
                if (target) {
                    target.classList.remove("th-sorted", "th-sorted_up");
                }
                target = event.target;
                while (target.tagName != "TH") {
                    target = target.parentNode;
                }
                target.classList.add("th-sorted");
                reverse = 1;
            } else {
                target.classList.toggle("th-sorted_up");
            }

            const index = target.cellIndex;

            // Sort by Alphabet
            function sortByAlph(a, b) {
                if (a.cells[index].textContent > b.cells[index].textContent) {
                    return reverse;
                }
                if (a.cells[index].textContent < b.cells[index].textContent) {
                    return -reverse;
                }
                // To provide stable sort: if elements are equal we keep them in the original order
                return a.rowIndex - b.rowIndex;
            }

            // Sort by Date
            function sortByDate(a, b) {
                const aDate = new Date(a.cells[index].innerText);
                const bDate = new Date(b.cells[index].innerText);
                if (aDate > bDate) {
                    return reverse;
                }
                if (aDate < bDate) {
                    return -reverse;
                }
                // To provide stable sort: if elements are equal we keep them in the original order
                return a.rowIndex - b.rowIndex;
            }
            // Stable sort of table rows.
            if (target.textContent.toLowerCase().indexOf("date") !== -1) {
                rowArray.sort(sortByDate);
            } else {
                rowArray.sort(sortByAlph);
            }

            for (let i = 0, len = rowArray.length; i < len; i++) {
                tBody.appendChild(rowArray[i]);
            }
            table.appendChild(tBody);
            reverse = -reverse;
        }
    }
}

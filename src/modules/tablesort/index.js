export default function initSort(...tableIDs) {
    for (let i = 0, len = tableIDs.length; i < len; i++) {
        const table = document.getElementById(tableIDs[i]);
        const tBody = table.tBodies[0];

        // The array of table rows to be sorted
        const rowArray = Array.prototype.slice.call(tBody.rows);

        // Table headings
        const tr = table.tHead.rows[0];

        let currentHeading;

        let sortDirection;

        tr.addEventListener("click", sortTable, false);

        function sortTable(event) {
            // If we sort for the first time or choose another heading
            if (currentHeading != event.target || !currentHeading) {
                // If we've already sorted by heading and now choose another heading
                if (currentHeading) {
                    currentHeading.classList.remove("th-sorted", "th-sorted_up");
                }
                currentHeading = event.target;
                while (currentHeading.tagName != "TH") {
                    currentHeading = currentHeading.parentNode;
                }
                currentHeading.classList.add("th-sorted");
                sortDirection = 1;
            }
            // If we sort the same heading
            else {

                currentHeading.classList.toggle("th-sorted_up");
            }
            // Index of the cells in a column to be sorted
            const index = currentHeading.cellIndex;

            // Sort by Alphabet
            function sortByAlph(a, b) {
                if (a.cells[index].textContent > b.cells[index].textContent) {
                    return sortDirection;
                }
                if (a.cells[index].textContent < b.cells[index].textContent) {
                    return -sortDirection;
                }
                // To provide stable sort: if elements are equal we keep them in the original order
                return a.rowIndex - b.rowIndex;
            }

            // Sort by Date
            function sortByDate(a, b) {
                const aDate = new Date(a.cells[index].innerText);
                const bDate = new Date(b.cells[index].innerText);
                if (aDate > bDate) {
                    return sortDirection;
                }
                if (aDate < bDate) {
                    return -sortDirection;
                }
                // To provide stable sort: if elements are equal we keep them in the original order
                return a.rowIndex - b.rowIndex;
            }
            // Stable sort of table rows.
            if (currentHeading.textContent.toLowerCase().indexOf("date") !== -1) {
                rowArray.sort(sortByDate);
            } else {
                rowArray.sort(sortByAlph);
            }

            for (let i = 0, len = rowArray.length; i < len; i++) {
                tBody.appendChild(rowArray[i]);
            }
            table.appendChild(tBody);
            sortDirection = -sortDirection;
        }
    }
}

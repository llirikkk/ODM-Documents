const incDocTable = document.getElementById("incoming-documents__table");
const tBody = incDocTable.tBodies[0];
// The array of table rows to be sorted
const rows = [].slice.call(tBody.rows);


// Table headings
const tr = incDocTable.tHead.rows[0];

// Current heading
let target = tr.cells[0];
let reverse = -1;

tr.addEventListener("click",sortTable, false);

function sortTable(event){
    if(target != event.target) {
        target.classList.remove("th-sorted", "th-sorted_up");
        target = event.target;
        target.classList.add("th-sorted");
        reverse = 1;
    } else {
        target.classList.toggle("th-sorted_up");
    }
    const index = target.cellIndex;

    // Stable sort of table rows.
    rows.sort(function(a, b){
       if(a.cells[index].textContent > b.cells[index].textContent){
           return reverse;
       }
        if(a.cells[index].textContent < b.cells[index].textContent){
            return -reverse;
        }
        // To provide stable sort: if elements are equal we keep them in the original order
        return a.rowIndex - b.rowIndex;
    });
    for (let i = 0, len = rows.length; i < len; i++){
        tBody.appendChild(rows[i]);
    }
    incDocTable.appendChild(tBody);
    reverse = -reverse;
}
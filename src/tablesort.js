const incDocTable = document.getElementById("incoming-documents__table");
const tBody = incDocTable.tBodies[0];
// The array of table rows to be sorted
const rows = [].slice.call(tBody.rows);


// Table headings
const tr = incDocTable.tHead.rows[0];


tr.addEventListener("click",sortTable, false);

function sortTable(event){
    let target = event.target;
    const index = target.cellIndex;

    // Stable sort of table rows.
    rows.sort(function(a, b){
       if(a.cells[index].textContent > b.cells[index].textContent){
           return 1;
       }
        if(a.cells[index].textContent < b.cells[index].textContent){
            return -1;
        }
        // To provide stable sort: if elements are equal we keep them in the original order
        return a.rowIndex - b.rowIndex;
    });
    for (let i = 0, len = rows.length; i < len; i++){
        tBody.appendChild(rows[i]);
    }
    incDocTable.appendChild(tBody);
}
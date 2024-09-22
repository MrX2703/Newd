// script.js

let excelData = [];
let filteredData = [];

// Function to load and read Excel file
document.getElementById('upload').addEventListener('change', function (event) {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Read the first sheet
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        excelData = sheet;
        displayTable(excelData); // Display full table initially
    };

    reader.readAsArrayBuffer(file);
});

// Function to display data in table
function displayTable(data) {
    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    if (data.length > 0) {
        // Set table headers
        const headers = Object.keys(data[0]);
        headers.forEach(header => {
            const th = document.createElement('th');
            th.innerText = header;
            tableHeader.appendChild(th);
        });

        // Populate table rows
        data.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.innerText = row[header] || '';
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }
}

// Function to filter data based on search input
function searchData() {
    const query = document.getElementById('search-input').value.toLowerCase();
    filteredData = excelData.filter(row => {
        return Object.values(row).some(val => val.toString().toLowerCase().includes(query));
    });
    displayTable(filteredData);
}

// Function to download filtered data as PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;

    if (filteredData.length === 0) {
        alert("No data to download.");
        return;
    }

    // Add header row to PDF
    const headers = Object.keys(filteredData[0]);
    doc.text(headers.join(' | '), 10, y);
    y += 10;

    // Add rows to PDF
    filteredData.forEach(row => {
        const rowData = headers.map(header => row[header] || '');
        doc.text(rowData.join(' | '), 10, y);
        y += 10;
    });

    doc.save('search_results.pdf');
}

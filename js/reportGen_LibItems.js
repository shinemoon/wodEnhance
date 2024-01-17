
function genLibPage(dat) {
    var dlist = parseCSV(dat);
    var tableHtml = createPivotTableWithFilter(dlist);
    $('body').append(tableHtml);
}
function parseCSV(csvText) {
    // Split the CSV text into lines
    var lines = csvText.split('\n');

    // Extract the header and remove surrounding quotes
    var headers = lines[0].replace(/"/g, '').split(';');

    // Initialize an array to store the dictionaries
    var result = [];

    // Iterate over the lines starting from the second line (index 1)
    for (var i = 1; i < lines.length; i++) {
        // Split each line into values
        var values = lines[i].replace(/"/g, '').split(';');

        // Create a dictionary and populate it with the header and corresponding values
        var entry = {};
        for (var j = 0; j < headers.length; j++) {
            // Exclude columns with undefined values
            if (values[j] !== undefined) {
                entry[headers[j]] = values[j];
            }
        }

        // Exclude rows where 'Name' is an empty string
        if (entry['Name'] !== '') {
            result.push(entry);
        }
    }

    return result;
}
function createPivotTableWithFilter(dataArray) {
    // Extract header names from the first dictionary
    var headers = Object.keys(dataArray[0]);

    // Create the table element
    var table = document.createElement('table');
    table.border = '1';

    // Create the header row with filter selects
    var headerRow = table.insertRow();
    for (var i = 0; i < headers.length; i++) {
        var headerCell = headerRow.insertCell(i);
        var filterSelect = createFilterSelect(headers[i], dataArray);
        headerCell.appendChild(filterSelect);
    }

    // Create the data rows
    for (var j = 0; j < dataArray.length; j++) {
        var dataRow = table.insertRow();
        for (var k = 0; k < headers.length; k++) {
            var dataCell = dataRow.insertCell(k);
            dataCell.innerHTML = dataArray[j][headers[k]];
        }
    }

    // Return the HTML code
    return table.outerHTML;
}

// Helper function to create a filter select element
function createFilterSelect(header, dataArray) {
    var uniqueValues = Array.from(new Set(dataArray.map(item => item[header])));

    var select = document.createElement('select');
    select.id = header + 'Filter';
    select.name = header + 'Filter';

    var option = document.createElement('option');
    option.value = ''; // Empty option for no filter
    option.text = 'Filter ' + header;
    select.appendChild(option);

    for (var i = 0; i < uniqueValues.length; i++) {
        var option = document.createElement('option');
        option.value = uniqueValues[i];
        option.text = uniqueValues[i];
        select.appendChild(option);
    }

    // Add event listener for filtering when select value changes
    select.addEventListener('change', function () {
        filterTable(header, select.value, dataArray);
    });

    return select;
}

// Helper function to filter the table based on the selected value
function filterTable(header, filterValue, dataArray) {
    var tableRows = document.querySelectorAll('table tr');

    for (var i = 1; i < tableRows.length; i++) {
        var cellValue = dataArray[i - 1][header];
        if (filterValue === '' || cellValue === filterValue) {
            tableRows[i].style.display = ''; // Show the row
        } else {
            tableRows[i].style.display = 'none'; // Hide the row
        }
    }
}
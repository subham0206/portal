const express = require('express');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Read existing Excel file
const existingWorkbook = new ExcelJS.Workbook();
let existingWorksheet; // Remove the global variable

existingWorkbook.xlsx.readFile(path.join(__dirname, 'bookings.xlsx'))
    .then(() => {
        existingWorksheet = existingWorkbook.getWorksheet('Bookings');
    })
    .catch(error => console.error('Error reading existing Excel file:', error));

app.get('/', (req, res) => {
    // 15_02_2024
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/book', async (req, res) => {
    const { name, mobile, date, time , advocate} = req.body;

    if (!existingWorksheet) {
        // If the worksheet is not available, respond with an error
        console.error('Error: Worksheet not available');
        return res.status(500).send('Internal Server Error');
    }

    // Additional validation can be performed here if needed
    console.log('Form submitted with data:', { name, mobile, date, time, advocate });

    // Append new data to the Excel file
    const newRow = existingWorksheet.addRow([name, mobile, date, time, 'Pending', advocate,'', '']);

    // Save the workbook
    existingWorkbook.xlsx.writeFile(path.join(__dirname, 'bookings.xlsx'))
        .then(() => console.log('Excel file updated successfully'))
        .catch((error) => console.error('Error writing to Excel file:', error));

    // 15/02/204
    if (advocate === 'advocate'){
        return res.status(200).send('Advoctae Booking succesfull !')
    }else{
        res.redirect('/payment.html');

    }

    // Redirect to payment.html res.redirect('/payment.html');
    
});

app.get('/payment.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'payment.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

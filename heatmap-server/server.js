const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module

const app = express();
const port = process.env.PORT || 3000; // Use Render's port or 3000 for local

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the same directory
app.use(express.static(path.join(__dirname)));

const dataFilePath = 'heatmap_data.json';

// Initialize data (if file doesn't exist, create it with an empty array)
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

// Endpoint to get all heatmap points
app.get('/heatmap-data', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading data.');
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to add a new heatmap point
app.post('/heatmap-data', (req, res) => {
    const newPoint = req.body; // Expects a JSON object with lat and lng

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading data.');
        }

        let heatmapData = JSON.parse(data);
        heatmapData.push(newPoint);

        fs.writeFile(dataFilePath, JSON.stringify(heatmapData), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                return res.status(500).send('Error writing data.');
            }
            res.status(201).send('Point added successfully.'); // 201 Created
        });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
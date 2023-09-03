const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const folderPath = path.join(__dirname, 'files');

// Create a folder if it doesn't exist
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// Middleware to parse JSON requests
app.use(express.json());

// Create an API endpoint to create a text file with the current timestamp
app.post('/createFile', (req, res) => {
const currentDate = new Date();
const dateString = currentDate.toISOString().split('T')[0]
const hours = currentDate.getHours().toString().padStart(2, '0');
const minutes = currentDate.getMinutes().toString().padStart(2, '0');
const seconds = currentDate.getSeconds().toString().padStart(2, '0');
const timeString = `${hours}-${minutes}-${seconds}`;
const fileName = `${dateString}-${timeString}.txt`;
console.log(fileName)
  const filePath = path.join(folderPath, fileName);

  const fileContent = currentDate.toString();

  fs.writeFile(filePath, fileContent, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create the file.' });
          }
          res.status(201).json({ message: 'File created successfully' });
        });
        
});

// Create an API endpoint to retrieve all text files in the folder
app.get('/getFiles', (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to retrieve files.' });
    }

    const textFiles = files.filter((file) => path.extname(file) === '.txt');
    res.status(200).json({ files: textFiles });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//imported packages
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();



// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//creates notes route
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
    

// Wildcard route to direct users to home page if no matching route has been found.
app.get('*', (req, res) => 
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/api/notes', (req, res) => {
    // Send a message to the client
    // res.status(200).json(`${req.method} request received for notes`);
    console.info(`${req.method}`)
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a review`)
    
    const {title, text} = req.body;

    if (req.body) {
      const newNotes = {
        title,
        text,
        note_id: uuid
      };

      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.log(err);
        }
          else {
            const notes = JSON.parse(data);

            notes.push(newNotes);

            fs.writeFile('./db/db.json',
              JSON.stringify(notes),
              (err) => 
              err ? console.error(err)
              : console.info('Updated Notes')
            );
          }
      });
      const response = {
        status: 'success',
        body: newNotes,
      };

      console.log(response);
      res.status(201).json(response);
  } 
  else {
    res.status(500).json('Error in posting review');
    }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);



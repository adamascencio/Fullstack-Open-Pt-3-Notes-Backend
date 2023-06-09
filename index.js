const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(cors());
app.use(morgan(":method :url :status - :response-time ms - :body"));
app.use(express.static('build'))

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const note = notes.find((note) => {
    return note.id.toString() === id;
  });
  note ? res.json(note) : res.status(404).end();
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = [...notes, note];

  res.json(note);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);

  res.status(204).end();
});

const PORT = process.env.port || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

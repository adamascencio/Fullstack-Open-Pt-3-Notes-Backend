const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

notesRouter.get("/:id", async (req, res, next) => {
  const note = await Note.findById(req.params.id)
  note ? res.json(note) : res.status(404).end() 
});

notesRouter.post("/", async (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  const savedNote = await note.save();
  res.status(200).json(savedNote);
});

notesRouter.delete("/:id", async (req, res, next) => {
  await Note.findByIdAndRemove(req.params.id)
  res.status(204).end()
});

notesRouter.put("/:id", (req, res, next) => {
  const { content, important } = req.body;

  const note = {
    content,
    important,
  };

  Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
    runValidators: true,
    content: "query",
  })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;

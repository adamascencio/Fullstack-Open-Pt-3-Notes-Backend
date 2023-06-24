const notesRouter = require("./controllers/notes");

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

app.use("/api/notes", notesRouter);
app.use(express.json());
app.use(cors());
app.use(morgan(":method :url :status - :response-time ms - :body"));
app.use(express.static("build"));
app.use(unknownEndpoint);
app.use(errorHandler);

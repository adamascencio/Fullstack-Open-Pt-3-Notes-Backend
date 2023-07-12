const mongoose = require("mongoose");
const { Schema } = mongoose;

const noteSchema = new Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

noteSchema.set("toJSON", {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);

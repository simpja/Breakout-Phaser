const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slugs"); // Make url friendly names

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: "Please enter a game name", // instead of just a boolean, true, this will print back our specified error message
  },
  slug: String,
  scoreTop: {
    type: Number,
    default: 0,
  },
  scoreBottom: {
    type: Number,
    default: 0,
  },
});

gameSchema.pre("save", function(next) {
  if (!this.isModified("name")) {
    next(); // skip it
    return; // stop this function here
  }
  this.slug = slug(this.name); // Uses the slug package we imported at the top to generate a slug
  next();
  // TODO: Make more resilient so slugs are unique
});

module.exports = mongoose.model("Game", gameSchema);

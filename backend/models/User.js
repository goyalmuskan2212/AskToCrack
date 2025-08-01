const { Type } = require("@google/genai");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        profileImageUrl: { type:String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
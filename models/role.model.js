const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        permissions: {
            type: Array,
            default: []
        },
        deleted:{
            type: Boolean,
            default: false
        },
        deletedAt: Date
    }, {
        timestamps: true
    }
);

const Role = mongoose.model("Role", roleSchema, "role"); // tên connect trong database

module.exports = Role;
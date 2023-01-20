const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator")

const EmployeeSchema = mongoose.Schema({
    EmployeeID: {
        type: Number,
        require: true,
        unique: true,
    },
    FirstName: {
        type: String,
        require: true,
    },
    LastName: {
        type: String,
        require: true,
    },
    PhoneNumber: {
        type: String,
        require: true,
    },
    Address: {
        type: String,
        require: true,
    },
    Designation: {
        type: String,
        require: true,
    },
    EmpStartDate: {
        type: String,
        require: true,
    }
});

EmployeeSchema.plugin(uniqueValidator)

const Employee = mongoose.model("employees", EmployeeSchema);
module.exports = Employee;
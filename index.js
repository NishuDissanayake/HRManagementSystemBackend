const express = require('express');
const mongoose = require('mongoose');
const app = express();

const EmployeeModel = require('./models/Employee')

app.use(express.json());

mongoose.connect('mongodb+srv://HRNishu:68sqAPCI9PGVgjRM@hr.kiuhayc.mongodb.net/hrms?retryWrites=true&w=majority', {
    useNewUrlParser: true,
});


app.get("/employee/all", async (req, res) => {

    try {
        EmployeeModel.find({}, (err, result) => {
            res.status(200).json(result);
        });
    } catch {
        res.status(400).json({ message: err.message })
    }

});


app.get('/employee/', async (req, res) => {
    const empID = req.query.EmployeeID
    EmployeeModel.find({ EmployeeID: empID }, (err, result) => {

        try{
            res.status(200).json({employee: result[0]});
        } catch {
            res.status(400).json({ message: err.message })
        }
       
        
    });
});

app.post("/employee/add", async (req, res) => {
    const EmployeeID = req.body.EmployeeID;
    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const PhoneNumber = req.body.PhoneNumber;
    const Address = req.body.Address;
    const Designation = req.body.Designation;
    const EmpStartDate = req.body.EmpStartDate;

    const employee = new EmployeeModel({
        EmployeeID: EmployeeID,
        FirstName: FirstName,
        LastName: LastName,
        PhoneNumber: PhoneNumber,
        Address: Address,
        Designation: Designation,
        EmpStartDate: EmpStartDate,
    });

    try {
        await employee.save();
        res.status(200).json({ message: 'employee added successful!' });
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

app.listen(5000, () => {
    console.log('Backend running on port 5000!');
});


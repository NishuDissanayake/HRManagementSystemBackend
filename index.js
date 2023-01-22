const express = require('express');
const mongoose = require('mongoose');
const app = express();

const EmployeeModel = require('./models/Employee');
const LeaveWFHModel = require('./models/LeaveWFH');
const ResourceModel = require('./models/Resources');
const ProjectModel = require('./models/Projects');

app.use(express.json());

mongoose.connect('mongodb+srv://HRNishu:68sqAPCI9PGVgjRM@hr.kiuhayc.mongodb.net/hrms?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


// Employee service
app.get("/employee/all", async (req, res) => {

    try {
        EmployeeModel.find({ DeleteFlag: false }, (err, result) => {
            res.status(200).json(result);
        });
    } catch {
        res.status(400).json({ message: err.message })
    }

});


app.get('/employee', async (req, res) => {
    const empID = req.query.EmployeeID
    EmployeeModel.find({ EmployeeID: empID }, (err, result) => {

        try {
            res.status(200).json({ employee: result[0] });
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
    const BasicSalary = req.body.BasicSalary;
    const AccountNumber = req.body.AccountNumber;
    const BankName = req.body.BankName;
    const AccHolderName = req.body.AccHolderName;
    const BranchName = req.body.BranchName

    const employee = new EmployeeModel({
        EmployeeID: EmployeeID,
        FirstName: FirstName,
        LastName: LastName,
        PhoneNumber: PhoneNumber,
        Address: Address,
        Designation: Designation,
        EmpStartDate: EmpStartDate,
        BasicSalary: BasicSalary,
        DeleteFlag: false,
        BankDetails: {
            AccountNumber: AccountNumber,
            BankName: BankName,
            AccHolderName: AccHolderName,
            BranchName: BranchName
        }
    });

    try {
        await employee.save();
        res.status(200).json({ message: 'employee added successful!' });
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});


app.put("/employee/remove", async (req, res) => {
    const Deleted = true;

    try {
        await EmployeeModel.findOneAndUpdate({ EmployeeID: req.query.EmployeeID }, { DeleteFlag: Deleted }, (err, result) => {
            res.status(200).json({ message: 'employee removed successful!' });
        });
    } catch (err) {
        console.log(err);
    }
});

app.put("/employee/update", async (req, res) => {

    const updateData = {
        Designation: req.body.Designation,
        PhoneNumber: req.body.PhoneNumber,
        BasicSalary: req.body.BasicSalary
    }

    try {
        await EmployeeModel.findOneAndUpdate({ EmployeeID: req.body.EmployeeID }, updateData, (err, result) => {
            res.status(200).json({ message: 'employee updated successful!' });
        });
    } catch (err) {
        console.log(err);
    }
});

app.put("/employee/update-bank-details", async (req, res) => {

    const BankDetails = {
        AccountNumber: req.body.AccountNumber,
        BankName: req.body.BankName,
        AccHolderName: req.body.AccHolderName,
        BranchName: req.body.BranchName
    }

    try {
        await EmployeeModel.findOneAndUpdate({ EmployeeID: req.body.EmployeeID }, { BankDetails: BankDetails }, (err, result) => {
            res.status(200).json({ message: 'bank details updated successful!' });
        });
    } catch (err) {
        console.log(err);
    }
});

app.put("/employee/add-salary", async (req, res) => {

    let leaveCountInMonth = 0;
    let BasicSalary = 0;
    let LossAmountPerLeave = 0;

    const Month = req.body.Month;
    const PaidDate = req.body.PaidDate;
    const EmployeeID = req.body.EmployeeID;
    const AdditionReason = req.body.AdditionReason;
    const AddAmount = req.body.AddAmount;
    const DeductionReason = req.body.DeductionReason;
    const DeductAmount = req.body.DeductAmount;


    try {
        let queryOne = await LeaveWFHModel.find({ ReqType: 'leave', Month: Month, EmployeeID: EmployeeID }).exec();
        leaveCountInMonth = queryOne.length;

        let queryTwo = await EmployeeModel.find({ EmployeeID: EmployeeID }).exec();

        queryTwo.map((i) => {
            BasicSalary = i.BasicSalary;
            LossAmountPerLeave = i.LossAmountPerLeave;
        })

        const NetSalary = BasicSalary - DeductAmount - (LossAmountPerLeave * leaveCountInMonth) + AddAmount

        const monthlySal = [
            {
                Month: Month,
                PaidDate: PaidDate,
                Additions: {
                    Reason: AdditionReason,
                    Amount: AddAmount
                },
                Deductions: {
                    Reason: DeductionReason,
                    Amount: DeductAmount
                },
                NetSalary: NetSalary
            }
        ]

        await EmployeeModel.findOneAndUpdate({ EmployeeID: req.body.EmployeeID }, { $addToSet: { SalaryForMonth: monthlySal } }, { upsert: true, new: true }, (err, result) => {
            res.status(200).json({ message: 'Salary added successful!' });
        }).exec();
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});


// Leave and wfh service

app.post("/lwfh/request", async (req, res) => {
    const EmployeeID = req.body.EmployeeID;
    const ReqType = req.body.ReqType;
    const RequestDate = req.body.RequestDate;
    const Month = req.body.Month;
    const Reason = req.body.Reason;

    const leavewfh = new LeaveWFHModel({
        EmployeeID: EmployeeID,
        ReqType: ReqType,
        RequestDate: RequestDate,
        Month: Month,
        Reason: Reason,
    });

    try {
        await leavewfh.save();
        res.status(200).json({ message: 'Leave Wfh requested!' });
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});


app.put("/lwfh/update-status", async (req, res) => {
    try {
        await LeaveWFHModel.findById(req.query.id, (err, updateItem) => {
            updateItem.Status = req.query.Status;
            updateItem.save();
            res.status(200).json({ message: `Leave Wfh updated to ${req.query.Status}!` });

        });
    } catch (err) {
        console.log(err);
    }
});


app.get("/lwfh/all", async (req, res) => {
    try {
        LeaveWFHModel.find({}, (err, result) => {
            res.status(200).json(result);
        });
    } catch {
        res.status(400).json({ message: err.message })
    }
});


app.get("/lwfh/list-by-status", async (req, res) => {
    try {
        LeaveWFHModel.find({ Status: req.query.Status }, (err, result) => {
            res.status(200).json(result);
        });
    } catch {
        res.status(400).json({ message: err.message })
    }
});

app.get("/lwfh/list-by-employee", async (req, res) => {
    try {
        LeaveWFHModel.find({ EmployeeID: req.query.EmployeeID }, (err, result) => {
            res.status(200).json(result);
        });
    } catch {
        res.status(400).json({ message: err.message })
    }
});

app.get("/lwfh/list-by-type", async (req, res) => {
    try {
        LeaveWFHModel.find({ ReqType: req.query.ReqType }, (err, result) => {
            res.status(200).json(result);
        });
    } catch {
        res.status(400).json({ message: err.message })
    }
});


// resource service
app.post("/resouces/add", async (req, res) => {
    const EmployeeID = req.body.EmployeeID;
    const ResourcesType = req.body.ResourcesType;
    const ResourcesName = req.body.ResourcesName;
    const Description = req.body.Description;
    const IssuedDate = req.body.IssuedDate;
    const Status = req.body.Status;

    const resource = new ResourceModel({
        EmployeeID: EmployeeID,
        ResourcesType: ResourcesType,
        ResourcesName: ResourcesName,
        Description: Description,
        IssuedDate: IssuedDate,
        Status: Status,
    });

    try {
        await resource.save();
        res.status(200).json({ message: 'Resource alocated successful!' });
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});


app.put("/resouces/update", async (req, res) => {
    try {
        await ResourceModel.findById(req.query.id, (err, updateItem) => {
            updateItem.Status = req.query.Status;
            updateItem.save();
            res.status(200).json({ message: `Resource updated to ${req.query.Status}!` });
        });
    } catch (err) {
        console.log(err);
    }
});

// Project service
app.post("/project/add", async (req, res) => {
    const EmployeeID = req.body.EmployeeID;
    const ManagerName = req.body.ManagerName;
    const ProjectName = req.body.ProjectName;
    const ProjectDuration = req.body.ProjectDuration;
    const StartDate = req.body.StartDate;
    const EndDate = req.body.EndDate;
    const Status = req.body.Status;

    const project = new ProjectModel({
        EmployeeID: EmployeeID,
        ManagerName: ManagerName,
        ProjectName: ProjectName,
        ProjectDuration: ProjectDuration,
        StartDate: StartDate,
        EndDate: EndDate,
        Status: Status,
    });

    try {
        await project.save();
        res.status(200).json({ message: 'Project alocated successful!' });
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});


app.put("/project/update", async (req, res) => {
    try {
        await ProjectModel.findById(req.query.id, (err, updateItem) => {
            updateItem.EndDate = req.query.EndDate;
            updateItem.Feedback = req.query.Feedback;
            updateItem.Status = req.query.Status;
            updateItem.save();
            res.status(200).json({ message: `Project updated to ${req.query.Status}!` });
        });
    } catch (err) {
        console.log(err);
    }
});


app.listen(5000, () => {
    console.log('Backend running on port 5000!');
});


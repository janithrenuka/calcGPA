import React, { Fragment , useState, useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Button, Grid } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import './dashboard.css';

toast.configure();  

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
}))(TableCell);
  
const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    
    submit: {
      width: '120px',
      height: '40px',
      color: 'black',
      float: 'right',
      fontSize: '18px',
      fontWeight: 'bolder',
      borderRadius: 15,
    },

    bar: {
        position: 'fixed',
        height: '10%',
        background: '#F5F5F5',
        textAlign: 'center',
        color: 'black',
        fontSize: '18px',
        fontWeight: 'bolder',
        margin: ''
    },

    formControl: {
        margin: theme.spacing(1),
        width: 200,
        height: 45,
    },

    input: {
        width: 200,
        height: 60,
    },

    button: {
        marginTop: 10,
        marginLeft: 15,
        height: 40,
        width: 70,
        fontSize: '18px',
        fontWeight: 'bold',
        borderRadius: 15,
    },

    table: {
        minWidth: 600,
    },

    cell: {
          width: 200,
    },

}));


const Dashboard = () => {

    const [dataList, setDataList] = useState([]);
    const [finalGpa, setFinalGpa] = useState([]);
    const [finalClass, setFinalClass] = useState([]);
    const [totalCredit, setTotalCredit] = useState([]);

    async function getData() {
        const res = await fetch("http://localhost:5000/gpa");
  
        const dataArray = await res.json();
  
        setDataList(dataArray);
  
        let creditSubgpa = 0;
        let tCredit = 0;
        for(let i = 0 ; i < dataArray.length ; i++ ) {
            creditSubgpa = dataArray[i].credit * dataArray[i].grade + creditSubgpa;
            tCredit = dataArray[i].credit + tCredit;
        };
        // console.log(creditSubgpa.toFixed(2));
        // console.log(tCredit);

        let finalCalculatedGpa = creditSubgpa / tCredit;
        
        //console.log(finalCalculatedGpa.toFixed(2));

        let className = "";
        if( finalCalculatedGpa.toFixed(2) >= 3.70) {
            className = "First Class"
            //setFinalClass(className);
        }else if( finalCalculatedGpa.toFixed(2) >= 3.30 && finalCalculatedGpa.toFixed(2) < 3.70) {
            className = "Second Upper Class"
            //setFinalClass(className);
        }else if( finalCalculatedGpa.toFixed(2) >= 3.00 && finalCalculatedGpa.toFixed(2) < 3.30) {
            className = "Second Lower Class"
            //setFinalClass(className);
        }else if( finalCalculatedGpa.toFixed(2) >= 2.00 && finalCalculatedGpa.toFixed(2) < 3.00) {
            className = "General Class"
            //setFinalClass(className);
        }else {
            className = "No Class"
            //setFinalClass(className);
        }

        setFinalClass(className);
        setFinalGpa(finalCalculatedGpa.toFixed(2));
        setTotalCredit(tCredit);
    };

    //console.log(dataList);
    console.log(finalGpa);
    console.log(totalCredit);
    console.log(finalClass);

    const [inputs, setInputs] = useState({
        subject_code: "",
    });

    const [year, setYear] = useState({});
    const [semester, setSemester] = useState({});
    const [credit, setCredit] = useState({});
    const [grade, setGrade] = useState({});

    const {subject_code} = inputs;

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name]
        : e.target.value})
    };

    const yearChange = (event) => {
        setYear(event.target.value);
    };

    const semesterChange = (event) => {
        setSemester(event.target.value);
    };

    const creditChange = (event) => {
        setCredit(event.target.value);
    };

    const gradeChange = (event) => {
        setGrade(event.target.value);
    };

    const onSubmitForm = async (e) => {
        e.preventDefault()

        try {

            const body = {subject_code, year, semester, credit, grade};
            console.log(subject_code);
            console.log(year);
            console.log(semester);
            console.log(credit);
            console.log(grade);
            const response = await fetch("http://localhost:5000/gpa/add", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(body)
            });

            const parseRes = await response.json()

            if(parseRes){
                //console.log(parseRes);
                window.location.reload();
                toast.success("Added Successfully");
            }else{
                
                toast.error(parseRes)
            }
            

        } catch (err) {
            console.error(err.message);
        }
    }


    useEffect(() => {
        getData();
    }, []);


    const classes = useStyles();

    return(
        <Fragment>
            <AppBar className={classes.bar}>
                <Grid container direction="row" alignItems="center">
                    <h1>My GPA</h1>
                </Grid>
            </AppBar>
            
            <div className="form">
                <center>
                    <div className="box tcase">
                        <center>
                            <h2>GPA</h2>
                            <h3>{finalGpa}</h3>
                        </center>
                        
                    </div>
                    <div className="box tcase">
                        <center>
                            <h2>Class</h2>
                            <h4 className={classes.className}>{finalClass}</h4>
                        </center>
                        
                    </div>
                    <div className="box tcase">
                        <center>
                            <h2>Credits</h2>
                            <h3 className={classes.totalCredit}>{totalCredit}</h3>
                        </center>
                        
                    </div>
                </center>
            </div>
            
            <div className="input_form">
                <form onSubmit={onSubmitForm}>
                    <center>
                        <TextField 
                            className={classes.input}
                            required 
                            name="subject_code"
                            id="subject_code" 
                            label="Subject Code" 
                            onChange = {e => onChange(e)}
                            //defaultValue="SCSxxxx"
                            placeholder="SCSxxx"
                        />

                        <FormControl className={classes.formControl}>
                            <InputLabel id="year">Academic Year</InputLabel>
                            <Select
                                labelId="year"
                                id="year"
                                name="year"
                                //value={age}
                                onChange={yearChange}
                                required
                                >
                                <MenuItem value={1}>First</MenuItem>
                                <MenuItem value={2}>Second</MenuItem>
                                <MenuItem value={3}>Third</MenuItem>
                                <MenuItem value={4}>Fourth</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <InputLabel id="semester">Semester</InputLabel>
                            <Select
                                labelId="semester"
                                id="semester"
                                name="semester"
                                //value={age}
                                onChange={semesterChange}
                                required
                                >
                                <MenuItem value={1}>First</MenuItem>
                                <MenuItem value={2}>Second</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <InputLabel id="credit">Credit</InputLabel>
                            <Select
                                labelId="credit"
                                id="credit"
                                name="credit"
                                //value={age}
                                onChange={creditChange}
                                required
                                >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <InputLabel id="grade">Grade</InputLabel>
                            <Select
                                labelId="grade"
                                id="grade"
                                name="grade"
                                //value={age}
                                onChange={gradeChange}
                                required
                                >
                                <MenuItem value={4.00}>A+</MenuItem>
                                <MenuItem value={4.00}>A</MenuItem>
                                <MenuItem value={3.70}>A-</MenuItem>
                                <MenuItem value={3.30}>B+</MenuItem>
                                <MenuItem value={3.00}>B</MenuItem>
                                <MenuItem value={2.70}>B-</MenuItem>
                                <MenuItem value={2.30}>C+</MenuItem>
                                <MenuItem value={2.00}>C</MenuItem>
                                <MenuItem value={1.70}>C-</MenuItem>
                                <MenuItem value={1.30}>D+</MenuItem>
                                <MenuItem value={1.00}>D</MenuItem>
                                <MenuItem value={0.00}>E</MenuItem>
                                <MenuItem value={0.00}>F</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <div className="btn_box">
                            <button className="add_btn">Add</button>
                        </div>
                    </center>
                </form>
            </div>

            <div className="data-table">
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell className={classes.cell} align="center">Subject Code</StyledTableCell>
                                <StyledTableCell className={classes.cell} align="center">Credit</StyledTableCell>
                                <StyledTableCell className={classes.cell} align="center">Grade</StyledTableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {dataList.map((row) => (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell className={classes.cell} align="center">{row.subject_code}</StyledTableCell>
                                    <StyledTableCell className={classes.cell} align="center">{row.credit}</StyledTableCell>
                                    <StyledTableCell className={classes.cell} align="center">{ (row.grade === 4.00) ? "A" : (row.grade === 3.70) ? "A-" : (row.grade === 3.30) ? "B-" : (row.grade === 3.00) ? "B" : (row.grade === 2.70) ? "B-" : (row.grade === 2.30) ? "C+" : (row.grade === 2.00) ? "C" : (row.grade === 1.70) ? "C-" : (row.grade === 1.30) ? "D+" : (row.grade === 1.00) ? "D" : "F"}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            
        </Fragment>
        
    );
};

export default Dashboard;
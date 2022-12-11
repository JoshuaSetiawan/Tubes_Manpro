import express from 'express';
import path from 'path';
import mysql from 'mysql';

const port = 8080;
const app = express();

// NOTE: password harus sesuai dengan password mysql

const pool = mysql.createPool({
    user: 'root',
    password: 'erwin08',
    database: 'gotbook',
    host: 'localhost',
    connectionLimit:10
});

const dbConnect = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if(err){
                reject(err);
            }
            else{
                resolve(conn);
            }
        })
    })
};

// Query
pool.query(`SELECT * FROM book1`, (err, result,fields) => {
    if(err){
        return console.log(err);
    }
    return console.log(result);
});

app.use(express.json());
app.set('view engine','ejs');

const staticPath = path.resolve('public');
app.use(express.static(staticPath));

app.use(express.urlencoded( { extended: true }));

app.listen(port , () => {
    console.log(`Server is listening on port ${port}`);
});

//kalo mau kirim parameter ke ejs harus dalam bentuk object

app.get('/', (req,res) => {
    res.render('home.ejs');
});

app.get('/grafikbar', (req,res) => {
    res.render('grafikbar.ejs');
});

app.get('/cari', (req,res) => {
    res.render('cari.ejs');
});

// app.post('/filterNama', multerParser.none(), (req,res) => {
//     let nama = req.body.FilterBP;
//     pool.query(`select * where Source = ?`, [nama],(err, result, fields)=>{
//         if(err){
//             return console.log(err);
//         }
//         nama = result[0].nama;
//     });  
// })

app.get('/graf', (req,res) => {
    res.render('graf.ejs');
});

app.use('/', (req,res) => {
    res.send('Halaman tidak ditemukan');
});
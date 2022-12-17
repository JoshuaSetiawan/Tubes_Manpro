import express from 'express';
import path from 'path';
import mysql from 'mysql';
import * as echarts from 'echarts';

const port = 8080;
const app = express();

// NOTE: password harus sesuai dengan password mysql

const pool = mysql.createPool({
    user: 'root',
    password: '',
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
    let arrTujuan;
    let arrHitung;
    res.render('cari.ejs', {arrTarget: arrTujuan, arrCount: arrHitung});
});

app.get('/graf', (req,res) => {
    res.render('graf.ejs');
});

app.post('/proses-grafik-bar', (req,res) => {
    //parameter ambil dari init
    const buku = req.body.book;
    pool.query(`SELECT source,COUNT(source) as 'banyak' FROM ${buku} GROUP BY source ORDER BY banyak DESC LIMIT 10`, (err, result,fields) => {
        if(err){
            return console.log(err);
        }
        let arrSumber = [];
        let arrBanyak = [];
        for (let i = 0; i < result.length; i++) {
            arrSumber[i] = result[i].source;
            arrBanyak[i] = result[i].banyak;
        }
        res.send({status: 'success', url:'/grafikbar', arrSource: arrSumber, arrCount: arrBanyak});
    });
});

app.post('/proses-graf', (req,res) => {
    const nomor = req.body.book;
    console.log(nomor+" proses graf");
    switch(nomor){
        case 'book1':
            pool.query(`SELECT source, weight, target FROM book1 ORDER BY weight DESC LIMIT 10`, (err, result,fields) => {
                if(err){
                    return console.log(err);
                }
                let arrSumber = [];
                let arrTujuan = [];
                let arrBerat = [];
                for (let i = 0; i < result.length; i++) {
                    arrSumber[i] = result[i].source;
                    arrTujuan[i] = result[i].target;
                    arrBerat[i] = result[i].weight;
                }
                res.send({status: 'success', url:'/dsa', arrSource: arrSumber, arrTarget: arrTujuan, arrWeight: arrBerat});
                // return console.log(result);
            });
            break;
    }
});

app.post('/proses-pencarian', (req,res) => {
    // const nomor = req.body.book;
    // const nama = req.body.name;
    const buku = 'book5';
    const nama = 'Arron';
    // console.log(nomor+" prroses pencarian");
    pool.query(`SELECT target as 'target1', (SELECT COUNT(target) FROM ${buku} WHERE target = target1) as count FROM ${buku} WHERE source LIKE '%${nama}%' GROUP BY target`, (err,result,fields) => {
        if(err){
            return console.log(err);
        }
        // return console.log(result);
        let arrTujuan = [];
        let arrHitung = [];
        for (let i = 0; i < result.length; i++) {
            arrTujuan[i] = result[i].target1;
            arrHitung[i] = result[i].count;
        }
        // res.send({status: 'success', url:'/cari', arrTarget: arrTujuan, arrCount: arrHitung});
        res.render('cari.ejs', {arrTarget: arrTujuan, arrCount: arrHitung});
    });
});

app.use('/', (req,res) => {
    res.render('test.ejs');
});
// app.use('/', (req,res) => {
//     res.send('Halaman tidak ditemukan');
// });
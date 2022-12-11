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
// pool.query(`SELECT * FROM book1`, (err, result,fields) => {
//     if(err){
//         return console.log(err);
//     }
//     return console.log(result);
// });

// pool.query(`SELECT `)


// pool.query(`SELECT source,COUNT(source) as 'banyak' FROM book1 GROUP BY source ORDER BY banyak DESC LIMIT 10`, (err, result,fields) => {
//     if(err){
//         return console.log(err);
//     }
//     return console.log(result);
// });

    // pool.query(`SELECT source,COUNT(source) as 'banyak' FROM book1 GROUP BY source ORDER BY banyak DESC LIMIT 10`, (err, result,fields) => {
    //     if(err){
    //         return console.log(err);
    //     }
    //     console.log(typeof(result));
    //     return result;
    // });

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

app.get('/graf', (req,res) => {
    res.render('graf.ejs');
});

app.post('/proses-grafik-bar', (req,res) => {
    //parameter ambil dari init
    const nomor = req.body.book;
    switch(nomor){
        case 'book1':
            pool.query(`SELECT source,COUNT(source) as 'banyak' FROM book1 GROUP BY source ORDER BY banyak DESC LIMIT 10`, (err, result,fields) => {
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
            break;
        case 'book2':
            pool.query(`SELECT source,COUNT(source) as 'banyak' FROM book2 GROUP BY source ORDER BY banyak DESC LIMIT 10`, (err, result,fields) => {
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
            break;
        case 'book3':
            pool.query(`SELECT source,COUNT(source) as 'banyak' FROM book3 GROUP BY source ORDER BY banyak DESC LIMIT 10`, (err, result,fields) => {
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
            break;
        case 'book4':
            pool.query(`SELECT source,COUNT(source) as 'banyak' FROM book4 GROUP BY source ORDER BY banyak DESC LIMIT 10`, (err, result,fields) => {
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
            break;
        case 'book5':
            pool.query(`SELECT source,COUNT(source) as 'banyak' FROM book5 GROUP BY source ORDER BY banyak DESC LIMIT 10`, (err, result,fields) => {
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
            break;
    }
});

app.use('/', (req,res) => {
    res.send('Halaman tidak ditemukan');
});
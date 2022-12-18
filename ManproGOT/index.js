import express from 'express';
import path from 'path';
import mysql from 'mysql';
import * as echarts from 'echarts';

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
    const buku = req.body.book;
    console.log(buku+" proses graf");
    pool.query(`SELECT source, weight, target FROM ${buku} ORDER BY weight DESC LIMIT 10`, (err, result,fields) => {
        if(err){
            return console.log(err);
        }
        let arrSumber = [];
        let arrBerat = [];
        let arrTujuan = [];
        for (let i = 0; i < result.length; i++) {
            arrSumber[i] = result[i].source;
            arrBerat[i] = result[i].weight;
            arrTujuan[i] = result[i].target;
        }
        console.log(result);
        res.send({status: 'success', url:'/grafikbar', arrSource: arrSumber, arrWeight: arrBerat, arrTarget: arrTujuan});
    });
});

// app.get('/proses-pencarian', (req,res) => {
//     const buku = req.query.buku;
//     const nama = req.query.nama;
// })

app.get('/proses-pencarian', async (req,res) => {
    // const buku = req.query.book;
    // const nama = req.query.name;
    // const buku = req.params.buku;
    // const nama = req.params.nama;

    const buku = "book1";
    const nama = "Arya";

    console.log(buku);
    console.log(nama);

    const jlhRow = await getRow(buku,nama);
    const numOfPages = 10;
    const pageCount = Math.ceil(jlhRow[0].jumlahRow/numOfPages);

    const start = req.query.start;
    let search;
    if(start == undefined){
        search = await getCari(0,numOfPages,buku,nama);
    }
    else{
        let limit = (numOfPages*(start-1));
        search = await getCari(limit, numOfPages,buku,nama);
    }
    let arrTujuan = [];
    let arrHitung = [];
    for (let i = 0; i < search.length; i++) {
        arrTujuan[i] = search[i].target1;
        arrHitung[i] = search[i].count;
    }
    res.render('cari',{arrTarget:arrTujuan,arrCount:arrHitung,pageCount, buku: buku, nama: nama});
});

// app.get('cari/?page=', (req,res) => {
//     const buku = req.body.book;
//     const nama = req.body.name;
//     console.log("masukkkk");
//     pool.query(`SELECT target as 'target1', (SELECT COUNT(target) FROM ${buku} WHERE target = target1) as count FROM ${buku} WHERE source LIKE '%${nama}%' GROUP BY target`, (err,result,fields) => {
//         if(err){
//             return console.log(err);
//         }
//         const resultPerPage = 10;
//         const numOfResults = result.length;
//         const numberOfPages = Math.ceil(numOfResults/resultPerPage);
//         let page = req.query.page ? Number(req.query.page) : 1;
//         console.log(page);
//         if(page > numberOfPages){
//             //res.redirect('/?book=' + book + '&name='+ nama +'&page='+encodeURIComponent(numberOfPages));
//             console.log("gw ada");
//             res.redirect('cari/?page='+encodeURIComponent(numberOfPages));
//         }
//         else if(page < 1){
//             res.redirect('cari/?page='+encodeURIComponent('1'));
//         }
//         //Determine the SQL limit starting number
//         const startingLimit = (page-1) * resultPerPage;
//         //get the relevant number of POSTS for this starting page
//         pool.query(`SELECT target as 'target1', (SELECT COUNT(target) FROM ${buku} WHERE target = target1) as count FROM ${buku} WHERE source LIKE '%${nama}%' GROUP BY target LIMIT ${startingLimit},${resultPerPage}`, (err, result,fields) => {
//             if(err){
//                 return console.log(err);
//             }
//             let arrTujuan = [];
//             let arrHitung = [];
//             for (let i = 0; i < result.length; i++) {
//                 arrTujuan[i] = result[i].target1;
//                 arrHitung[i] = result[i].count;
//             }
//             let iterator = (page - 5) < 1 ? 1 : page - 5;
//             let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
//             if(endingLink < (page + 4)){
//                 iterator -= (page + 4) - numberOfPages;
//             }
//             res.render('cari.ejs',{arrTarget: arrTujuan, arrCount: arrHitung, page, iterator, endingLink, numberOfPages});
//         });
//     });
// });

// app.use('/', (req,res) => {
//     res.send('Halaman tidak ditemukan');
// });

const getCari = (start, limit, buku, nama) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT target as 'target1', (SELECT COUNT(target) FROM ${buku} WHERE target = target1) as count FROM ${buku} WHERE source LIKE '%${nama}%' GROUP BY target LIMIT ?,?`, [start,limit], (err, result) => {
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        });
    });
};

// const getRow = (buku, nama) => {
//     return new Promise((resolve, reject) => {
//         pool.query(`SELECT count(target) as 'jumlahRow', (SELECT COUNT(target) FROM ${buku} WHERE target = target1) as count FROM ${buku} WHERE source LIKE '%${nama}%' GROUP BY target`, (err, result) => {
//             if(err){
//                 reject(err);
//             }
//             else{
//                 resolve(result);
//             }
//         });
//     });
// };

const getRow = (buku, nama) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT count(target) as 'jumlahRow' FROM ${buku} WHERE source LIKE '%${nama}%'`, (err, result) => {
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        });
    });
};


app.get('/admin-daftarruangan', async(req, res) => {
    if (req.session.loggedin && req.session.idTipe === 5) {
    const jumlahRow = await getJumlahRowRuangan();
    const pageCount = Math.ceil(jumlahRow[0].jumlahRow/show);
    //console.log(pageCount);
    const start = req.query.start;
    let ruangan
    if(start === undefined){
    ruangan = await getRuangan(0, show);
    }else{
    let limitStart = (show*(start-1));
    ruangan = await getRuangan(limitStart, show);
    }
    res.render('admin-daftarruangan', {
    listruangan: ruangan,
    pageCount
    });
    }
    else {
    res.sendFile(path.join(__dirname +'/public/login.html'));
    }
    });
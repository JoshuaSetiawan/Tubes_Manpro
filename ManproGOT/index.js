import express from 'express';
import path from 'path';

const port = 8080;
const app = express();

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

app.get('/grafbar', (req,res) => {
    res.render('grafbar.ejs');
});

app.get('/cari', (req,res) => {
    res.render('cari.ejs');
});

app.get('/grafik', (req,res) => {
    res.render('grafik.ejs');
});

app.use('/', (req,res) => {
    res.send('Halaman tidak ditemukan');
});
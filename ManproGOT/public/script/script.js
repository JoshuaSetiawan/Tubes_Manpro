// import { format } from "mysql";
// import * as echarts from '../../node_modules/echarts';
// import * as echarts from '../../node_modules/echarts/core.js';

// const searching = this.document.getElementById('body')


// function myFunction() {
//     var input, filter, ul, li, a, i, txtValue;
//     input = document.getElementById('');
//     filter = input.value.toUpperCase();
//     ul = document.getElementById("");
//     li = ul.getElementsByTagName('');
  
//     // Loop through all list items, and hide those who don't match the search query
//     for (i = 0; i < li.length; i++) {
//       a = li[i].getElementsByTagName("a")[0];
//       txtValue = a.textContent || a.innerText;
//       if (txtValue.toUpperCase().indexOf(filter) > -1) {
//         li[i].style.display = "";
//       } else {
//         li[i].style.display = "none";
//       }
//     }
//   }

function myFunction() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
      } else {
          li[i].style.display = "none";
      }
  }
}

// class Graph {
//   constructor(noOfVertices) {
//     this.noOfVertices = noOfVertices;
//     this.AdjList = new Map();
//   }

//   addVertex(v) {
//     this.AdjList.set(v, []);
//   }

//   addEdge(v, w) {
//     this.AdjList.get(v).push(w);

//     this.AdjList.get(w).push(v);
//   }

//   printGraph() {
//     var get_keys = this.AdjList.keys();

//     for (var i of get_keys) {
//       var get_values = this.AdjList.get(i);
//       var conc = "";

//       for (var j of get_values)
//         conc += j + " ";

//       console.log(i + " -> " + conc);
//     }
//   }

//   BFS(startingNode) {

//     var visited = {};

//     var q = new Queue();

//     visited[startingNode] = true;
//     q.enqueue(startingNode);

//     while (!q.isEmpty()) {
//       var getQueueElement = q.dequeue();

//       console.log(getQueueElement);

//       var get_List = this.AdjList.get(getQueueElement);

//       for (var i in get_List) {
//         var neigh = get_List[i];

//         if (!visited[neigh]) {
//           visited[neigh] = true;
//           q.enqueue(neigh);
//         }
//       }
//     }
//   }

//   DFS(startingNode) {
//     var visited = {};

//     this.DFSUtil(startingNode, visited);
//   }

//   DFSUtil(vert, visited) {
//     visited[vert] = true;
//     console.log(vert);

//     var get_neighbours = this.AdjList.get(vert);

//     for (var i in get_neighbours) {
//       var get_elem = get_neighbours[i];
//       if (!visited[get_elem])
//         this.DFSUtil(get_elem, visited);
//     }
//   }


// }

function encodeURL(data){
  const ret = [];
  for (let d in data){
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }
  return ret.join('&');
}


//Grafik Bar
const form = document.getElementById("form");
let barchart;
if(form != null){
  form.addEventListener("submit", onSubmitGrafBar);
}


function onSubmitGrafBar(event){
  event.preventDefault();
  let formElements = event.currentTarget.elements;
  // console.log(formElements[0].value);
  const obj = {book: formElements[0].value};
  let str = encodeURL(obj);
  // console.log(str);

  const init = {
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: str
  };

  

  fetch('proses-grafik-bar',init)
  .then(res => {
    console.log(res.status);
    return res.text();
  })
  .then(result => {
    let resultJSON = JSON.parse(result);
    if(resultJSON.status == 'success'){
      console.log('sukses');
      console.log(resultJSON);
      const ctx = document.getElementById('myChart');
      if(barchart != null){
        barchart.destroy();
      }
      barchart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: resultJSON.arrSource,
            datasets: [{
                label: 'Jumlah interaksi dengan karakter lain',
                data: resultJSON.arrCount,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                beginAtZero: true
                }
            }
        }
      });
    }
    // console.log(result);
  })
}

//Erwin - Graf - gak kepake, scriptnya udah ada di ejs
function onSubmitGraf(buku){
  const obj = {book: buku};
  let str = encodeURL(obj);
  console.log(str);

  const init = {
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: str
  };

  fetch('proses-graf',init)
  .then(res => {
    console.log(res.status);
    return res.text();
  })
  .then(result => {
    let resultJSON = JSON.parse(result);
    if(resultJSON.status == 'success'){
      console.log('sukses');
      console.log(resultJSON);

      let arr1PreNodes = [];
      let arr1Nodes = [];
      let arrNodes = [];

      for(let i = 0; i < 20; i++){
        if(i < 10){
          arr1PreNodes[i] = resultJSON.arrSource[i];
        }
        else if(i >= 10){
          arr1PreNodes[i] = resultJSON.arrTarget[i-10];
        }
      }

      for(let value of arr1PreNodes){
        if(arr1Nodes.indexOf(value) === -1){
          arr1Nodes.push(value);
        }
      }

      for (let i = 0; i < arr1Nodes.length; i++) {
        arrNodes[i] = {id:arr1Nodes[i], label: arr1Nodes[i]};
      }

      let arr1PreEdges = [];
      let arr1Edges = [];
      let arrEdges = [];

      for (let i = 0; i < resultJSON.arrSource.length; i++) {
        arrEdges[i] = {from:resultJSON.arrSource[i], to:resultJSON.arrTarget[i]};
      }

      console.log(arrNodes);
      console.log(arrEdges);

      let nodes = new vis.DataSet(arrNodes);

      let edges = new vis.DataSet(arrEdges);

      let container = document.getElementById('canvasGraph');

      let data = {
        nodes: nodes,
        edges: edges
      };

      let options = {};

      let network = new vis.Network(container,data,options);
    }
  })
}

//Pencarian
// const formNama = document.getElementById("search-nama");
// let table;
// if(formNama != null){
//   formNama.addEventListener("submit", onSubmitCari);
// }

// function onSubmitCari(event){
//   event.preventDefault();
//   let formElements = event.currentTarget.elements;
//   // console.log(formElements[0].value);
//   const obj = {book: formElements[0].value, name: formElements[1].value};
//   let str = encodeURL(obj);

//   const init = {
//     method: 'post',
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded"
//     },
//     body: str
//   };

//   fetch('proses-pencarian',init)
//   .then(res => {
//     console.log(res.status);
//     return res.text();
//   })
//   .then(result => {
//     let resultJSON = JSON.parse(result);
//     if(resultJSON.status == 'success'){
//       let dataCount = resultJSON.arrCount;
//       let dataTarget = resultJSON.arrTarget;
//       console.log(dataCount);
//       console.log(dataTarget);
//       addRow(dataCount, dataTarget);
//     }
//   })
// }

// function addRow(dataCount, dataTarget){
//   let tableParent = document.getElementById("divTable");
//   if(table != null){
//     table.remove();

//     table = document.createElement("table");
    
//     let row1 = document.createElement("tr");

//     let cTarget = document.createElement("td");
//     let cCount = document.createElement("td");

//     cTarget.innerText = "Target";
//     cCount.innerText = "Count";

//     row1.appendChild(cTarget);
//     row1.appendChild(cCount);

//     table.appendChild(row1);


//     for (let i = 0; i < dataCount.length; i++) {
//       //create row
//       let row = document.createElement("tr");

//       //create cells
//       let c1 = document.createElement("td");
//       let c2 = document.createElement("td");

//       //insert data to cells
//       c1.innerText = dataTarget[i];
//       c2.innerText = dataCount[i];

//       //append cells to row
//       row.appendChild(c1);
//       row.appendChild(c2);

//       //append row to table
//       table.appendChild(row);
//     }
//     tableParent.appendChild(table);
//   }
//   else{
//     table = document.createElement("table");
    
//     let row1 = document.createElement("tr");

//     let cTarget = document.createElement("td");
//     let cCount = document.createElement("td");

//     cTarget.innerText = "Target";
//     cCount.innerText = "Count";

//     row1.appendChild(cTarget);
//     row1.appendChild(cCount);

//     table.appendChild(row1);


//     for (let i = 0; i < dataCount.length; i++) {
//       //create row
//       let row = document.createElement("tr");

//       //create cells
//       let c1 = document.createElement("td");
//       let c2 = document.createElement("td");

//       //insert data to cells
//       c1.innerText = dataTarget[i];
//       c2.innerText = dataCount[i];

//       //append cells to row
//       row.appendChild(c1);
//       row.appendChild(c2);

//       //append row to table
//       table.appendChild(row);
//     }
//     tableParent.appendChild(table);
//   }
// }
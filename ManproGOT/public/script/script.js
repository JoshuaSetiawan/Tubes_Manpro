// import { format } from "mysql";
// import * as echarts from '../../node_modules/echarts';
// import * as echarts from '../../node_modules/echarts/core.js';

const searching = this.document.getElementById('body')


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

//Erwin - Graf
// const formGraf = document.getElementById("formGraf");
// if(formGraf != null){
//   formGraf.addEventListener("submit", onSubmitGraf);
// }

// function onSubmitGraf(event){
//   event.preventDefault();
//   let formElements = event.currentTarget.elements;
//   // console.log(formElements[0].value);
//   const obj = {book: formElements[0].value};
//   let str = encodeURL(obj);

//   const init = {
//     method: 'post',
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded"
//     },
//     body: str
//   };

//   fetch('proses-graf',init)
//   .then(res => {
//     console.log(res.status);
//     return res.text();
//   })
//   .then(result => {
//     let resultJSON = JSON.parse(result);
//     if(resultJSON.status == 'success'){
//       console.log('sukses');
//       console.log(resultJSON);
//       const ctx = document.getElementById('myGraph');
//       const myGraph = echarts.init(ctx,'dark');

//       let option = {
//         title: {
//           text: 'Basic Graph'
//         },
//         tooltip: {},
//         animationDurationUpdate: 1500,
//         animationEasingUpdate: 'quinticInOut',
//         series: [
//           {
//             type: 'graph',
//             layout: 'none',
//             symbolSize: 50,
//             roam: true,
//             label: {
//               show: true
//             },
//             edgeSymbol: ['circle', 'arrow'],
//             edgeSymbolSize: [4, 10],
//             edgeLabel: {
//               fontSize: 20
//             },
//             data: [
//               {
//                 name: 'Node 1',
//                 x: 300,
//                 y: 300
//               },
//               {
//                 name: 'Node 2',
//                 x: 800,
//                 y: 300
//               },
//               {
//                 name: 'Node 3',
//                 x: 550,
//                 y: 100
//               },
//               {
//                 name: 'Node 4',
//                 x: 550,
//                 y: 500
//               }
//             ],
//             // links: [],
//             links: [
//               {
//                 source: 0,
//                 target: 1,
//                 symbolSize: [5, 20],
//                 label: {
//                   show: true
//                 },
//                 lineStyle: {
//                   width: 5,
//                   curveness: 0.2
//                 }
//               },
//               {
//                 source: 'Node 2',
//                 target: 'Node 1',
//                 label: {
//                   show: true
//                 },
//                 lineStyle: {
//                   curveness: 0.2
//                 }
//               },
//               {
//                 source: 'Node 1',
//                 target: 'Node 3'
//               },
//               {
//                 source: 'Node 2',
//                 target: 'Node 3'
//               },
//               {
//                 source: 'Node 2',
//                 target: 'Node 4'
//               },
//               {
//                 source: 'Node 1',
//                 target: 'Node 4'
//               }
//             ],
//             lineStyle: {
//               opacity: 0.9,
//               width: 2,
//               curveness: 0
//             }
//           }
//         ]
//       }
//       option && myGraph.setOption(option);
//     }
//   })
// }

//Pencarian
const formNama = document.getElementById("search-nama");
if(formNama != null){
  formNama.addEventListener("submit", onSubmitCari);
}


function onSubmitCari(event){
  event.preventDefault();
  let formElements = event.currentTarget.elements;
  // console.log(formElements[0].value);
  const obj = {book: formElements[0].value, name: formElements[1].value};
  let str = encodeURL(obj);

  const init = {
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: str
  };

  fetch('proses-pencarian',init)
  .then(res => {
    console.log(res.status);
    return res.text();
  })
  .then(result => {
    let resultJSON = JSON.parse(result);
    if(resultJSON.status == 'success'){
      let list = document.getElementById("myUL");
      let dataCount = resultJSON.arrCount;
      let dataTarget = resultJSON.arrTarget;
      // window.location.replace(resultJSON.url);
    }
  })
}
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

class Graph {
  constructor(noOfVertices) {
    this.noOfVertices = noOfVertices;
    this.AdjList = new Map();
  }

  addVertex(v) {
    this.AdjList.set(v, []);
  }

  addEdge(v, w) {
    this.AdjList.get(v).push(w);

    this.AdjList.get(w).push(v);
  }

  printGraph() {
    var get_keys = this.AdjList.keys();

    for (var i of get_keys) {
      var get_values = this.AdjList.get(i);
      var conc = "";

      for (var j of get_values)
        conc += j + " ";

      console.log(i + " -> " + conc);
    }
  }

  BFS(startingNode) {

    var visited = {};

    var q = new Queue();

    visited[startingNode] = true;
    q.enqueue(startingNode);

    while (!q.isEmpty()) {
      var getQueueElement = q.dequeue();

      console.log(getQueueElement);

      var get_List = this.AdjList.get(getQueueElement);

      for (var i in get_List) {
        var neigh = get_List[i];

        if (!visited[neigh]) {
          visited[neigh] = true;
          q.enqueue(neigh);
        }
      }
    }
  }

  DFS(startingNode) {
    var visited = {};

    this.DFSUtil(startingNode, visited);
  }

  DFSUtil(vert, visited) {
    visited[vert] = true;
    console.log(vert);

    var get_neighbours = this.AdjList.get(vert);

    for (var i in get_neighbours) {
      var get_elem = get_neighbours[i];
      if (!visited[get_elem])
        this.DFSUtil(get_elem, visited);
    }
  }
}
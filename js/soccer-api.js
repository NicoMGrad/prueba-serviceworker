const main = document.getElementById("table-main");

function openSoccerApi(){
  const fetchPromise = fetch(`js/soccer.json`);
  fetchPromise.then(response => {
    return response.json();
  }).then(result => {
    printMatches(result.data);
  }).catch(err =>{
    console.log('Ohhh fallo!: ', err);
  });
}

function printMatches(data){
  const value = data.fixtures.map(match => `<tr><td>${match.home_name}</td><td>${match.away_name}</td><td>${match.location}</td><td>${match.date}</td><td>${match.time}</td></tr>`).join("\n");

  main.innerHTML = `${value}`
}

// Escuchemos si esta online
document.addEventListener("estamoActivo", function(e) {
  openSoccerApi();
});
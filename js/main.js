// Event Listener para Offline/ Online Status

navigator.serviceWorker.register('./service-worker.js', { scope: '/' })
        .then(function (registration)
        {
          console.log('Service worker registered successfully');
        }).catch(function (e)
        {
          console.error('Error during service worker registration:', e);
        });

/*if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../service-worker.js', { scope: '/' })
        .then(reg => {
          console.log("Service worker esta listo!");
        });
   }
   else {
    console.log("Service worker no soportado.");
   }
*/
window.addEventListener('offline', event => {
    document.querySelector('body').classList.add('offline');
    main.innerHTML = "No obtener los partidos! La aplicación esta offline!"
   });
    
   window.addEventListener('online', event => {
    document.querySelector('body').classList.remove('offline');
    openSoccerApi();
   });
    
   if (!navigator.onLine) {
    document.querySelector('body').classList.add('offline');
    main.innerHTML = "No obtener los partidos! La aplicación esta offline!"
   }
   
   const isOnline = async () => {
    try {
      // El "cache no-store" es para que el fetch no guarde en cache el request
      // Si esto pasara, responderia el cache del browser y no el resultado de tener conexion
      const response = await fetch('https://code.jquery.com/jquery-3.6.0.slim.min.js', {cache: "no-store"});
      console.log(response.json());
      
      if (response.url == "http://127.0.0.1:5500/offline.html"){
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('offline and rejected', error)
      return false;
    }
  }
  
  isOnline().then(
    // Resolve, estamos online
    resp => {
      if (resp){
        // Creo un evento
        var evento = new CustomEvent("estamoActivo", {});
  
        // Lo Disparo!
        document.dispatchEvent(evento);
      } else {
        document.querySelector('body').classList.add('offline');
      }
    },
    // Reject, estamos offline
    ()=> {document.querySelector('body').classList.add('offline');}
  );
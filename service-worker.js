const cacheName = 'cache-version-2';
    
// Archivos/Recursos que vamos a "cachear"
const precache = [
 './js/main.js',
 './js/soccer-api.js',
 './js/game.js',
 './css/main.css',
 './css/bootstrap-5.0.css',
 './css/main.css',
 './index.html',
 './404.html',
 './offline.html',
 './img/icon-192x192.png',
 './img/icon-256x256.png',
 './img/icon-384x384.png',
 './img/icon-512x512.png',
 './img/green.jpg',
 './js/game/createjs_1.1_min.js',
 './js/game/zim_7.0.1.js',
 './js/game/icon.js',
 './js/game/Box2dWeb-2.1.a.3.min.js',
 './js/game/physics_1.0.js',
 './js/game/game_1.0.4.js'
];

// Instalación
self.addEventListener('install', event => {

// Hago a este SW el activo, matando otros
// Sino quedan caches inactivos
self.skipWaiting();

event.waitUntil(
    // Abro el cache, entonces agrego los archivos/recursos
    caches.open(cacheName).then(cache => {
        return cache.addAll(precache)
    })
);
});

// Update - Es decir, si cambia una parte del SW (nombre), updatea el cache
self.addEventListener('activate', event => {
  
  const cacheWhitelist = [cacheName];
    // Esto es lo que updatea cada una de las keys en el mapa del caché
    event.waitUntil(
        // Tomo las keys y las paso para revisar individualmente
        caches.keys().then(cacheNames => {
          // devuelvo Promesa
          return Promise.all(
              // Hago un map, para borrar key individualmente.
              // Recuerden que era el update, asi que precisa un delete.
              cacheNames.map(cacheName => {
                if (cacheWhitelist.indexOf(cacheName) === -1) {
                  return caches.delete(cacheName);
                }
              })
          )
        })
    );
});

function shouldAcceptResponse(response) {
  return response.status !== 0 && !(response.status >= 400 && response.status < 500) ||
      response.type === 'opaque' ||
      response.type === 'opaqueredirect';
}
// Creamos el cache a partir de fetch de recursos
self.addEventListener('fetch', event => {
    // Chequeamos si existe en cache para el render de pagina
    // sino vamos a hacer cache del nuevo request
    event.respondWith(
        caches.open(cacheName).then(cache => { // Abrimos el cache actual
          return cache.match(event.request).then(response => {
           
            // Matcheo! - return response, se lo pasamos al promise abajo
            if (response) {
              return response;
            }
    
          // Tomamos el response cache de arriba
          return fetch(event.request).then(
            function(response) {
    
              // Chequeamos si recibimos una respuesta valida
              if(shouldAcceptResponse(response)) {
                return response;
              }
    
              // Hay que clonar la respuesta
              // La respuesta es un stream, y como queremos que el browser
              // consuma la respuesta como si el cache consumiera la respuesta,
              // necesitamos clonarla para asi tener dos streams: (https://streams.spec.whatwg.org/)
              var responseToCache = response.clone();
    
              // Aca lo que hace es guardar los recursos que vinieron del server
              caches.open(cacheName)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
    
              return response;
            }
          )
          }).catch(error => {
            console.log('Fallo SW', error); // importantisimo para saber si tenemos un error en algun lado.
            // si el cache falla, mostramos offline page
            return caches.match('offline.html');
          });
        })
    );
});

// mejor:
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
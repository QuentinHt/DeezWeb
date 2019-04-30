//  AVEC LA BIBLIOTHÈQUE FETCH-JSONP (POUR CEUX QUI PRÉFÈRENT LES PROMESSES JS)

fetchJsonp("https://api.deezer.com/search?q=pnl&output=jsonp")
    .then(response => response.json())
    .then(musiques => {

        console.log(musiques);

        document.querySelector('#results').innerHTML =
            musiques.data.map(m => m.title).join('<br>');

    });

//  AVEC JQUERY

$.ajax({
    url : 'https://api.deezer.com/search?q=pnl&output=jsonp',
    dataType : 'jsonp'
}).done(function(musiques) {

    console.log(musiques);

    document.querySelector('#results').innerHTML =
            musiques.data.map(m => m.title).join('<br>');

});
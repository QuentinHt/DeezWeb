     // Initialisation //

     // Fonction qui génère un nombre aléatoire sur un intervalle de nombre donné

     function entierAleatoire(min, max) {
         return Math.floor(Math.random() * (max - min + 1)) + min;
     }
     // Initialisation de la valeur de CompteurCle dans le localStorage si elle n'existe pas déjà

     if (localStorage.getItem('compteurCle') == undefined) {
         localStorage.setItem('compteurCle', 0);
     }

     // Index //

     // Si il y a des favoris, on récupère une musique aléatoirement parmis elle puis on l'affiche dans la page d'accueil

     if (Object.keys(localStorage).length != 1) {
         var favAleatoire = entierAleatoire(1, Object.keys(localStorage).length - 1);
         var valueFavIndex = JSON.parse(localStorage.getItem(Object.keys(localStorage)[favAleatoire]))
         $('.mainIndex').children('section').html("<div class='music-cartouche'><i class='fas fa-star buttonFav'></i><img src='" + valueFavIndex[0] + "'></img><audio controls><source src='" + valueFavIndex[1] + "'></audio><p>" + valueFavIndex[2] + "</p><p>" + valueFavIndex[3] + "</p><span class='hiddenInf'>" + valueFavIndex[4] + "</span><i class='fas fa-random'></i></div>")
     }
     $('.mainIndex').children('.SectionFav').on('click', '.buttonFav', function () {
         for (var j = 1; j < Object.keys(localStorage).length; j++) {
             if (JSON.parse(localStorage.getItem(Object.keys(localStorage)[j]))[4] == $(this).siblings('.hiddenInf').html()) {
                 localStorage.removeItem(Object.keys(localStorage)[j])
             }
         }
         if (Object.keys(localStorage).length == 1) {
             $('.mainIndex').children('.SectionFav').html("<h1>Vous ne semblez pas avoir de favoris... Pourquoi ne pas aller faire un tour du côté de <a href='search.html'>nos musiques</a> pour retrouver vos titres préférés ?</h1>")
         } else {
             var favAleatoire = entierAleatoire(1, Object.keys(localStorage).length - 1);
             var valueFavIndex = JSON.parse(localStorage.getItem(Object.keys(localStorage)[favAleatoire]))
             $('.mainIndex').children('section').html("<div class='music-cartouche'><i class='fas fa-star buttonFav'></i><img src='" + valueFavIndex[0] + "'></img><audio controls><source src='" + valueFavIndex[1] + "'></audio><p>" + valueFavIndex[2] + "</p><p>" + valueFavIndex[3] + "</p><span class='hiddenInf'>" + valueFavIndex[4] + "</span><i class='fas fa-random'></i></div>")
         }
     })
     $('.mainIndex').children('.SectionFav').on('click', '.fa-random', function () {
         var favAleatoire = entierAleatoire(1, Object.keys(localStorage).length - 1);
         var valueFavIndex = JSON.parse(localStorage.getItem(Object.keys(localStorage)[favAleatoire]))
         $('.mainIndex').children('section').html("<div class='music-cartouche'><i class='fas fa-star buttonFav'></i><img src='" + valueFavIndex[0] + "'></img><audio controls><source src='" + valueFavIndex[1] + "'></audio><p>" + valueFavIndex[2] + "</p><p>" + valueFavIndex[3] + "</p><span class='hiddenInf'>" + valueFavIndex[4] + "</span><i class='fas fa-random'></i></div>")
     })

     // Search

     // Fonction à l'envoi du formulaire pour afficher les musiques correspondants à la recherche

     $.ajax({
         url: 'https://api.deezer.com/chart?output=jsonp',
         dataType: 'jsonp'
     }).done(function (musiques) {
             // Affichage des musiques obtenues après l'envoi du formulaire

         for (var i = 0; i < musiques.tracks.data.length; i++) {
             $('.mainSearch').children('.musique').append("<div class='music-cartouche'><i class='far fa-star buttonFav'></i><img src='" + musiques.tracks.data[i].album.cover_medium + "'></img><audio controls><source src='" + musiques.tracks.data[i].preview + "'></audio><p>" + musiques.tracks.data[i].title + "</p><p>" + musiques.tracks.data[i].artist.name + " - " + musiques.tracks.data[i].album.title + "</p><span class='hiddenInf'>" + musiques.tracks.data[i].id + "</span></div>")
         }
         for (var i = 0; i < 5; i++) {
             $('.mainSearch').children('section:nth-of-type(1)').children('.actuMusic').children('.buttonArtist').children('button:nth-of-type(' + (i + 1) + ')').html(musiques.artists.data[i].name)
         }
         for (var i = 0; i < 5; i++) {
             $('.mainSearch').children('section:nth-of-type(1)').children('.actuMusic').children('.buttonAlbum').children('button:nth-of-type(' + (i + 1) + ')').html(musiques.albums.data[i].title)
         }
     });

     $('.mainSearch').children('section:nth-of-type(1)').children('#form-search').on('submit', function (e) {
         e.preventDefault();

         // Nettoyage des résultats de la recherche précédente

         $('.mainSearch').children('.musique').html('');
         // Mise en place de l'appel ajax 
         $.ajax({
             url: 'https://api.deezer.com/search?q=' + $('#form-search input[type=text]').val() + '&output=jsonp&order=' + $('#form-search select').val(),
             dataType: 'jsonp'
         }).done(function (musiques) {

             // Affichage des musiques obtenues après l'envoi du formulaire

             for (var i = 0; i < musiques.data.length; i++) {
                 $('.mainSearch').children('.musique').append("<div class='music-cartouche'><i class='far fa-star buttonFav'></i><img src='" + musiques.data[i].album.cover_medium + "'></img><audio controls><source src='" + musiques.data[i].preview + "'></audio><p>" + musiques.data[i].title + "</p><p>" + musiques.data[i].artist.name + " - " + musiques.data[i].album.title + "</p><span class='hiddenInf'>" + musiques.data[i].id + "</span></div>")
             }

             // Modification de la cartouche de la musique si elle fait déjà parti des favoris 

             for (var j = 1; j < Object.keys(localStorage).length; j++) {
                 for (var k = 0; k < $('.mainSearch').children('.musique').children().length; k++) {
                     if (JSON.parse(localStorage.getItem(Object.keys(localStorage)[j]))[4] == musiques.data[k].id) {
                         $('.mainSearch').children('.musique').children('div:nth-of-type(' + (k + 1) + ')').children('i').css('color', 'rgb(223, 177, 26)');
                         $('.mainSearch').children('.musique').children('div:nth-of-type(' + (k + 1) + ')').children('i').removeClass('far');
                         $('.mainSearch').children('.musique').children('div:nth-of-type(' + (k + 1) + ')').children('i').addClass('fas');
                         //$('.mainSearch').children('.musique').children('div:nth-of-type(' + (k + 1) + ')').children('button').children('span').html('music' + j)
                     }
                 }
             }
         })
     });

     $('.actuMusic .buttonArtist button').click(function() {
        $.ajax({
            url: 'https://api.deezer.com/search?q=' + $(this).text() + '&output=jsonp&order=ARTIST_DESC',
            dataType: 'jsonp'
        }).done(function (musiques) {
            
            // Affichage des musiques obtenues après l'envoi du formulaire

            for (var i = 0; i < musiques.data.length; i++) {
                $('.mainSearch').children('.musique').append("<div class='music-cartouche'><i class='far fa-star buttonFav'></i><img src='" + musiques.data[i].album.cover_medium + "'></img><audio controls><source src='" + musiques.data[i].preview + "'></audio><p>" + musiques.data[i].title + "</p><p>" + musiques.data[i].artist.name + " - " + musiques.data[i].album.title + "</p><span class='hiddenInf'>" + musiques.data[i].id + "</span></div>")
            }
     })
    })

     // Ajout d'une musique en favori au clic sur le bouton favori

     $('.mainSearch').children('.musique').on('click', '.buttonFav', function () {

         // Si la musique est déjà en favori on la retire et on modifie le bouton favori

         if ($(this).css('color') == "rgb(223, 177, 26)") {
             $(this).css('color', 'black');
             $(this).removeClass('fas');
             $(this).addClass('far');
             for (var j = 1; j < Object.keys(localStorage).length; j++) {
                 if (JSON.parse(localStorage.getItem(Object.keys(localStorage)[j]))[4] == $(this).siblings('.hiddenInf').html()) {
                     localStorage.removeItem(Object.keys(localStorage)[j])
                 }
             }
         }

         // Si elle n'y est pas, on la rajoute dans le localStorage et on modifie sa forme.
         else {
             $(this).css('color', 'rgb(223, 177, 26)');
             $(this).removeClass('far');
             $(this).addClass('fas');
             var compteurCle = localStorage.getItem('compteurCle');
             var reachMusic = $(this).parent();
             var value = [reachMusic.children('img').attr('src'), reachMusic.children('audio').children('source').attr('src'), reachMusic.children('p:nth-of-type(1)').html(), reachMusic.children('p:nth-of-type(2)').html(), reachMusic.children('span').html()]
             localStorage.setItem("music" + compteurCle, JSON.stringify(value));
             compteurCle = parseInt(compteurCle, 10) + 1
             localStorage.setItem('compteurCle', compteurCle);
         }
     })

     // Fav //

     // On affiche dans la page favori toutes les musiques conservées dans le localStorage

     for (var i = 1; i < Object.keys(localStorage).length; i++) {
         var valueFav = JSON.parse(localStorage.getItem(Object.keys(localStorage)[i]))
         $('.mainFav').children('.musicFav').append("<div class='music-cartouche'><i class='fas fa-star buttonFav'></i><img src='" + valueFav[0] + "'></img><audio controls><source src='" + valueFav[1] + "'></audio><p>" + valueFav[2] + "</p><p>" + valueFav[3] + "</p><span class='hiddenInf'>" + valueFav[4] + "</span></div>")
     }

     // Fontion pour retirer une musique des favori

     $('.mainFav').children('.musicFav').on('click', '.buttonFav', function () {
         for (var j = 1; j < Object.keys(localStorage).length; j++) {
             if (JSON.parse(localStorage.getItem(Object.keys(localStorage)[j]))[4] == $(this).siblings('.hiddenInf').html()) {
                 localStorage.removeItem(Object.keys(localStorage)[j])
             }
         }
         $(this).parent().remove()
     })
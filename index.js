         // ----------------------------------------- Initialisation ----------------------------------------------- //

         $(document).ready(function () {

             // Fonction qui génère un nombre aléatoire sur un intervalle de nombre donné

             function entierAleatoire(min, max) {
                 return Math.floor(Math.random() * (max - min + 1)) + min;
             }
             // Initialisation de la valeur de CompteurCle dans le localStorage si elle n'existe pas déjà

             if (localStorage.getItem('compteurCle') == undefined) {
                 localStorage.setItem('compteurCle', 0);
             }

             // ----------------------------------------- Page Index.html ----------------------------------------------- //

             // Création de la fonction qui récupère une musique aléatoirement parmis nos favoris

             function MusicFavAleatoire() {
                 var favAleatoire = entierAleatoire(1, Object.keys(localStorage).length - 1);
                 var valueFavIndex = JSON.parse(localStorage.getItem(Object.keys(localStorage)[favAleatoire]))
                 $('.mainIndex').children('section').html("<div class='music-cartouche'><i class='fas fa-star buttonFav'></i><img src='" + valueFavIndex[0] + "'></img><audio controls><source src='" + valueFavIndex[1] + "'></audio><p>" + valueFavIndex[2] + "</p><p>" + valueFavIndex[3] + "</p><span class='hiddenInf'>" + valueFavIndex[4] + "</span><i class='fas fa-random'></i></div>")
             }

             // Si il y a des favoris, on appelle cette fonction

             if (Object.keys(localStorage).length != 1) {
                 MusicFavAleatoire()
             }

             // Fonction permettant de supprimer des favoris celui qui a été choisi aléatoirement, on resélectionne ensuite un favori aléatoire

             $('.mainIndex').children('.SectionFav').on('click', '.buttonFav', function () {
                 for (var j = 1; j < Object.keys(localStorage).length; j++) {
                     if (JSON.parse(localStorage.getItem(Object.keys(localStorage)[j]))[4] == $(this).siblings('.hiddenInf').html()) {
                         localStorage.removeItem(Object.keys(localStorage)[j])
                     }
                 }
                 if (Object.keys(localStorage).length == 1) {
                     $('.mainIndex').children('.SectionFav').html("<h1>Vous ne semblez pas avoir de favoris... Pourquoi ne pas aller faire un tour du côté de <a href='search.html'>nos musiques</a> pour retrouver vos titres préférés ?</h1>")
                 } else {
                     MusicFavAleatoire()
                 }
             })

             // Bouton qui permet de retirer un favori aléatoire

             $('.mainIndex').children('.SectionFav').on('click', '.fa-random', function () {
                 MusicFavAleatoire()
             })

             // ----------------------------------------- Page Search.html ----------------------------------------------- //

             // Fonction permettant d'afficher les musiques selon les données reçues par la requête Ajax

             function afficheMusic(path, limit, pathWrite) {
                 for (var i = 0; i < limit; i++) {
                     $(pathWrite).append("<div class='music-cartouche'><i class='far fa-star buttonFav'></i><img src='" + path.data[i].album.cover_medium + "'></img><audio controls><source src='" + path.data[i].preview + "'></audio><p>" + path.data[i].title + "</p><p>" + path.data[i].artist.name + " - " + path.data[i].album.title + "</p><span class='hiddenInf'>" + path.data[i].id + "</span></div>")
                 }
             }

             // Fonction permettant de vérifier si les musiques générées font déjà parties des favoris

             function verifFav(dataMusic, path) {
                 for (var j = 1; j < Object.keys(localStorage).length; j++) {
                     for (var k = 0; k < $(path).children().length; k++) {
                         if (JSON.parse(localStorage.getItem(Object.keys(localStorage)[j]))[4] == dataMusic.data[k].id) {
                             $(path).children('div:nth-of-type(' + (k + 1) + ')').children('i').css('color', 'rgb(223, 177, 26)');
                             $(path).children('div:nth-of-type(' + (k + 1) + ')').children('i').removeClass('far');
                             $(path).children('div:nth-of-type(' + (k + 1) + ')').children('i').addClass('fas');
                         }
                     }
                 }
             }

             // Fonction au chargement de la page pour afficher les musiques du top 10

             $.ajax({
                 url: 'https://api.deezer.com/chart?output=jsonp',
                 dataType: 'jsonp'
             }).done(function (musiques) {
                 afficheMusic(musiques.tracks, musiques.tracks.data.length, '.mainSearch .musique .musicTop50')
                 verifFav(musiques.tracks, '.mainSearch .musique .musicTop50')

                 // Affichage des 5 artistes du moment dans l'espace recherche à gauche

                 for (var i = 0; i < 5; i++) {
                     $('.mainSearch').children('section:nth-of-type(1)').children('.actuMusic').children('.buttonArtist').children('button:nth-of-type(' + (i + 1) + ')').html(musiques.artists.data[i].name)
                 }

                 // Affichage des 5 albums du moment dans l'espace recherche à gauche

                 for (var i = 0; i < 5; i++) {
                     $('.mainSearch').children('section:nth-of-type(1)').children('.actuMusic').children('.buttonAlbum').children('button:nth-of-type(' + (i + 1) + ')').html(musiques.albums.data[i].title)
                 }
             });

             // Fonction qui permet la recherche depuis le champs au recherche à l'envoi du formulaire

             $('.mainSearch').children('section:nth-of-type(1)').children('#form-search').on('submit', function (e) {
                 e.preventDefault();

                 // Nettoyage des résultats de la recherche précédente

                 $('.mainSearch').children('.musique').html('');

                 // Affichage des musiques avec la requête ajax selon ce qui est tapé dans le formulaire

                 $.ajax({
                     url: 'https://api.deezer.com/search?q=' + $('#form-search input[type=text]').val() + '&output=jsonp&order=' + $('#form-search select').val(),
                     dataType: 'jsonp'
                 }).done(function (musiques) {

                    // Si le résultat de la recherche ne contient rien, renvoie un message d'erreur, sinon affiche normalement les musiques

                     if (musiques.data == "") {
                         $('.mainSearch').children('.musique').html("<h1>Mince ! Il semblerait que votre recherche n'a rien donné, vérifiez l'ortographe et recommencez !<br<br>Sinon choisissez directement parmis nos catégories prédéfinies pour trouver les meilleurs titres du moment !</h1>");
                     } else {
                         afficheMusic(musiques, musiques.data.length, '.mainSearch .musique')
                         verifFav(musiques, '.mainSearch .musique')
                     }
                 })

             });


             // Fonction permettant d'afficher des musiques d'un des artistes du moment à l'aide de la rubrique prévue à cet effet à gauche

             $('.actuMusic .buttonArtist button').click(function () {
                 console.log($(this).text())
                 $.ajax({
                     url: 'https://api.deezer.com/search?q=' + $(this).text() + '&output=jsonp&order=RANKING',
                     dataType: 'jsonp'
                 }).done(function (musiques) {
                     console.log(musiques)
                     $('.mainSearch').children('.musique').html('');
                     afficheMusic(musiques, 15, '.mainSearch .musique')
                     verifFav(musiques, '.mainSearch .musique')
                 })
             })

             // Fonction permettant d'afficher les musiques d'un des albums du moment à l'aide de la rubrique prévue à cet effet à gauche

             $('.actuMusic .buttonAlbum button').click(function () {
                 $.ajax({
                     url: 'https://api.deezer.com/search?q=album:"' + $(this).text() + '"&output=jsonp',
                     dataType: 'jsonp'
                 }).done(function (musiques) {
                     $('.mainSearch').children('.musique').html('');
                     afficheMusic(musiques, 15, '.mainSearch .musique')
                     verifFav(musiques, '.mainSearch .musique')
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

             // ------------------------------------------- Page Fav.html ------------------------------------------------- //

             // On affiche dans la page favori toutes les musiques conservées dans le localStorage, s'il n'y en a pas renvoie un message indiquant d'aller ajouter des musiques en favori via la page de recherche

             if (Object.keys(localStorage).length != 1) {
                 $('.mainFav').children('.musicFav').html('')
                 for (var i = 1; i < Object.keys(localStorage).length; i++) {
                     var valueFav = JSON.parse(localStorage.getItem(Object.keys(localStorage)[i]))
                     $('.mainFav').children('.musicFav').append("<div class='music-cartouche'><i class='fas fa-star buttonFav'></i><img src='" + valueFav[0] + "'></img><audio controls><source src='" + valueFav[1] + "'></audio><p>" + valueFav[2] + "</p><p>" + valueFav[3] + "</p><span class='hiddenInf'>" + valueFav[4] + "</span></div>")
                 }

                 // Fontion pour retirer une musique des favoris

                 $('.mainFav').children('.musicFav').on('click', '.buttonFav', function () {
                     for (var j = 1; j < Object.keys(localStorage).length; j++) {
                         if (JSON.parse(localStorage.getItem(Object.keys(localStorage)[j]))[4] == $(this).siblings('.hiddenInf').html()) {
                             localStorage.removeItem(Object.keys(localStorage)[j])
                         }
                     }
                     $(this).parent().remove()
                 })
             } else {
                 $('.mainFav').children('.musicFav').html('<h1>Vous ne semblez pas avoir de favoris... Pourquoi ne pas aller faire un tour du côté de <a href="search.html">nos musiques</a> pour retrouver vos titres préférés ?</h1>')
             }
         })
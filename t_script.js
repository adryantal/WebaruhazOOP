$(function () {
  const termekTomb = [];
  let vegOsszeg = 0;
  const kosarObjTomb = []; //előkészítek egy kosarObjTomb-ot, amelyben az egyes termékek kosárbeli előfordulásának számát és egységárát fogom tárolni

  adatbeolvas("termekek.json", termekTomb, function () {
    megjelenit(termekTomb);
  });

  function adatbeolvas(fajlnev, tomb, myCallback) {
    $.ajax({
      url: fajlnev,
      success: function (result) {
        //console.log(result);
        result.lista.forEach((element) => {
          tomb.push(element); //pakolja be a tombbe a beolvasott json fileban levo lista elemeit
        });
        //console.log(tomb.length);
        //itt teljes a tomb --> itt kell meghivni az adatbetoltest v.egyeb fuggvenyt
        myCallback(tomb);
      },
    });
    //console.log(tomb.length);
    //itt mar ures a tomb
  }

  function megjelenit(termekTomb) {
   
    valasztekFeltolt();
    kosarbaHelyez();
    kosarbolEltavolit();
    darabSzamModosit();
  }

  function darabSzamModosit(){
    $(window).on("modositTermekDb", function (event) { 
      // console.log("eloford: " +event.detail.db + event.detail.nev);       
       kosarObjTomb.forEach((element) => {
         if (element.nev == event.detail.nev) {
           element.elofordulas = event.detail.db; //a db input mezőbe beírt értékre frissítem a termék előfordulásának számát a kosarObjTomb-ben
           let index = 0;  
           $(".tetel_bal").each(function () {
             if ($(this).children("span").html().includes(event.detail.nev)) {                        
               $(this).children("input").val(element.elofordulas);                          
               $(".tetel_osszeg").eq(index).html(element.elofordulas*element.egysegar); //a megfelelő tétel tetel_osszeg "mezőjébe" beszúrom az aktuális részösszeget/tételösszeget            
               return;
             }
            index++;   
           });          
         }
       });
       vegosszegKiir();
     }) 
  }

  function kosarbolEltavolit() {
    $(window).on("kosarbolEltavolit", function (event) {
      // console.log("esemény elkapva");
      event.detail.elem.remove(); //az eseményt kiváltó objektumhoz tartozó HTML DOM elem leválasztása a szülőelemről
      kosarObjTomb.forEach((element) => {       
        if (element.nev == event.detail.adat.nev) {        
          element.elofordulas = 0; //nullázom az előfordulást a kosarObjTomb-ben (a törlés (x) gombbal az összes előfordulást eltávolítom a kosárból)
          return;
        }
      });
      if ($(".tetel").length) {     //ha van tétel a kosárban, akkor írja ki a végösszeget
        vegosszegKiir();
      } else {
        $("#osszeg").empty();       //különben semmit
        $("#osszeg").removeClass("osszeg");
      }
    });
    
  }

  function valasztekFeltolt() {
    $(".tetel input").css("visibility","hidden"); //ne jelenjen meg a termékszám módosítására alkalmas input mező
    const szuloElem = $("#valasztek");
    const sablonElem = $(".termek");
    termekTomb.forEach(function (element, index) {
      //console.log(element);
      let ujElem = sablonElem.clone().appendTo(szuloElem);
      let ujTermek = new Termek(ujElem, element);      
      kosarObjTomb.push({ "nev": element.nev, "elofordulas": 0, "egysegar": element.ar });
    });
    sablonElem.remove();
    //console.log(kosarObjTomb); 
  }

  function kosarbaHelyez() {    
    const kosarSzuloElem = $("#kosar");
    const kosarSablonElem = $(".tetel");

    $(window).on("termekKosarba", function (event) {
      $("#osszeg").empty();
      //  console.log("esemény elkapva:" + event.detail.nev, event.detail.kep, event.detail.leiras, event.detail.ar);
     
      tobbszorElofordul = false;
      kosarObjTomb.forEach((element) => {       
        if (element.nev == event.detail.adat.nev) {
          element.elofordulas++; //ha beletettem a kosárba, 1-el növelem az előfordulást a kosarObjTomb-ben
          let index = 0;  
          $(".tetel_bal").each(function () {
            if ($(this).children("span").html().includes(event.detail.adat.nev)) {
              tobbszorElofordul = true;
              //console.log("többször előfordul"); 
              $(this).children("input").val(element.elofordulas);              
              $(".tetel_osszeg").eq(index).html(element.elofordulas*event.detail.adat.ar); //a tételösszeg = előfordulás * egységár             
              return;                                                                      //a megfelelő tétel tetel_osszeg "mezőjébe" beszúrom az aktuális részösszeget/tételösszeget
            }
           index++;
          });
        }        
      });     

      if (!tobbszorElofordul) {  //csak akkor kreáljon új kosárobjektumot, ha még nem fordul elő a kosárban azonos adattagokkal rendelkező obj.
        $(".tetel input").css("visibility","visible");
        let ujKosarElem = kosarSablonElem.clone().appendTo(kosarSzuloElem);
        let adatok = { //a kattintáseseményt kiváltó objektum adataiból új "adatobjektumot" építek fel          
          nev: event.detail.adat.nev,
          ar: event.detail.adat.ar,
        };
        let kosarObj = new KosarTetel(ujKosarElem, adatok); //a kattintáseseményt kiváltó objektum adatait felhasználva létrehozok egy új kosárobjektumot
        kosarObj.setAllapot(true);
        kosarSablonElem.remove();        
      }
      vegosszegKiir();
    });    
  }

  function vegosszegKiir() {
    vegOsszeg=0;
    $(".tetel_osszeg").each(function(){  //a részösszegeket (tételösszegeket) szummázva kiszámolom a végösszeget
      vegOsszeg+=parseInt($(this).html());
      console.log(vegOsszeg); 
    })
    $("#osszeg").html("Összesen: " + vegOsszeg);
    $("#osszeg").addClass("osszeg");
  }
});

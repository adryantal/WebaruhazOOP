class KosarTetel {
  constructor(htmlDOMElem, adat) {
    this.elem = htmlDOMElem;
    this.adat = adat;

    // console.log(this.elem);
    this.tNevElem = this.elem.children(".tetel_bal").children("span");
    this.tArElem = this.elem.children(".tetel_jobb").children("span").eq(0); //a "tetel" kontener "tetel_jobb" oszt. "span" unokajanak elso (0. indexu) eloford.
    this.torolElem = this.elem.children(".tetel_jobb").children("span").eq(1); //a "tetel" kontener "tetel_jobb" oszt. "span" unokajanak masodik (1. indexu) eloford.
    this.dbElem = this.elem.children(".tetel_bal").children("input");
    this.kosarban_van = true;

    this.setAdatok(this.adat);

    this.torolElem.on("click", () => {
      this.kosarbolEltavolit();
      //console.log(this);
      this.setAllapot(false);
    });

    this.dbElem.bind("keyup mouseup", () => {
      //ha megváltoztatom az egy adott termékből a kosárba tett mennyiséget a dbszámmezőbe beírt értékkel
      //console.log("changed");
      if (this.dbElem.val() >= 1) {//tételenként min. 1 db terméknek kell szerepelnie a kosárban (ha nem kívánunk a termékből vásárolni, a tételt törölni kell)
        this.modositTermekDb();
        //console.log(this.dbElem.val());
      } else {
        this.setDb(1);
      }
    });
  }

  setAdatok(ertek) {
    this.tNevElem.html(ertek.nev);
    this.tArElem.html(ertek.ar);
    this.torolElem.html("<input type='button' class='.torol' name='torol' value='x'/>"); //töröl - torolGomb beszúrása az adott objektumba
    this.setDb(1);
  }

  setDb(db) {
    this.dbElem.val(db);
  }

  setAllapot(ertek) {
    this.kosarban_van = ertek;
  }

  kosarbolEltavolit() {
    //azt figy., hogy kattintva lett az x (töröl) gombra egy adott kosárbeli termék mellett, s ezt hozzaadjuk az ablak obj-hoz
    let esemeny = new CustomEvent("kosarbolEltavolit", {
      detail: this, //a detail segitsegevel tudjuk atadni, melyik obj. valtotta ki az esemenyt
    });
    window.dispatchEvent(esemeny); //a foablakhoz adom az esemenyt, melyet majd a t_script.js-ben el tudok kapni
  }

  modositTermekDb() {
    let esemeny = new CustomEvent("modositTermekDb", {
      detail: { nev: this.tNevElem.html(), db: this.dbElem.val() }, //a termék nevét és az aktuális kosárbeli dbszámát adja át
    });
    window.dispatchEvent(esemeny);
  }
}

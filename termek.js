class Termek {
    constructor(htmlDOMElem, adat) {
        this.elem = htmlDOMElem;
        this.adat = adat;
        //console.log(this.adat);
        // console.log(this.elem);
        this.tNevElem = this.elem.children("h3");
        this.tKepElem = this.elem.children("img");
        this.tArElem = this.elem.children("span");
        this.tLeirasElem = this.elem.children("p");
        this.tGombElem = this.elem.children("input"); //Kosárba gomb     

        this.setAdat(this.adat);
        //this.tNevElem.html(this.adat.nev);
        //this.tLeirasElem.html(this.adat.leiras);
        //this.tKepElem.attr("src", this.adat.kep);

        this.tGombElem.on("click", () => {
            this.kattintasTrigger();
            //console.log(this);
            
        });
    }

    //az az obj. adattagjainak adatokkal történő feltöltése (az adatokat majd a termekTomb elemeiből fogja kiszedni példányosításkor)
    setAdat(ertek) {
        this.tNevElem.html(ertek.nev);
        this.tArElem.html(ertek.ar);
        this.tKepElem.attr("src", ertek.kep);
        this.tLeirasElem.html(ertek.leiras);
        
    }

    kattintasTrigger() {
        //azt figy., hogy kattintva lett a Kosárba gombra egy adott termék kártyáján, s ezt hozzaadjuk az ablak obj-hoz
        let esemeny = new CustomEvent("termekKosarba", {
            detail: this //a detail segitsegevel tudjuk atadni, melyik obj. valtotta ki az esemenyt
        });
        window.dispatchEvent(esemeny); //a foablakhoz adom az esemenyt, melyet majd a t_script.js-ben el tudok kapni
    }

    
   

}

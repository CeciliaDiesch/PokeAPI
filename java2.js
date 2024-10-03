
let promError = false;

function getGoodPromise() {
    return new Promise((resolve, reject) =>{
        setTimeout(() => {
            console.log("good")
                resolve("done_good");
        }, 2000);
    });
}

function getBadPromise() {
    return new Promise((resolve, reject) =>{
        setTimeout(() => {
            console.log("bad")
                reject("done_bad");
        }, 2000);
    });
}

/* Then. das brauch t kein await und muss nicht async sein, aber veraltete version */
function usePromise(){
    getGoodPromise().then(
        /*(result) => {               //ist eine Fkt aber kein Fkts-Aufruf
            console.log(result);
        }*/
       getBadPromise                   //ist eine Fkt, wäre ein Aufruf mit () dahinter
    ).then(                             //hinter die man nun ein verschachteltes then bauen kann
        getGoodPromise                  //mit nochmaliger Fktsausführung
    ).then(
        (result) => {               //ist eine Fkt aber kein Fkts-Aufruf
            console.log(result);
        }
    ).catch((xError) => {               // kann zu jeder Zeit der Promise fkt greifen und agieren, also wenn zweite Fkt getBadPromise ist und reject zurückkommt, wird fehler gecatched und das rejectete ausgegeben "done Bad"
        console.error(xError);
    })
}

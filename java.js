
let promError = false;

function getPromise() {
    return new Promise((resolve, reject) =>{
        setTimeout(() => {
            console.log("1")
            if(promError){
                reject("hat nicht geklappt");
            }else{
                resolve("hat geklappt");
            }
        }, 2000);
    });
}


function getPromise2() {
    return new Promise((resolve, reject) =>{
        setTimeout(() => {
            console.log("2")
            if(promError){                 //mit ! umgedreht um einen Fall zu simulieren, bei dem diese fkt nicht klappt, was dann danach passiert, diese fct führt zu eine error
                reject("hat nicht geklappt");
            }else{
                resolve("hat geklappt");
            }
        }, 2000);
    });
}

function getPromise3() {
    return new Promise((resolve, reject) =>{
        setTimeout(() => {
            console.log("3")
            if(!promError){
                reject("hat nicht geklappt");
            }else{
                resolve("hat geklappt");
            }
        }, 2000);
    });
}

/* Grundlage
function usePromise(){
    let prom = getPromise();
    console.log(prom)
}*/

/*async und await ( man wartet auf die komplette durchführung einer promise fkt, aber nicht, dass ein komplettes html skript geladen ist oä)
async function usePromise(){
    let prom = await getPromise();  //um resolve anzeigen zu können muss eine fkt warten "await" und die fkt muss dafür asynchron sein async function usePromise()
    console.log("prom2")            //es dauert dann 2 sekunden bis prom2 angezeigt wird        
    console.log(prom)               //gibt hat geklappt aus wenn promError auf false steht, sonst hat nicht geklappt bei promError =true   
}*/

/* try and catch versucht den fehler aufzufangen und für den user unsichtbar zu machen, nur für mich sichtbar
async function usePromise(){
    let prom = "nothing happened";  //prom variable ausserhalb try and catch klammern definieren
    try {
        prom = await getPromise();     //gibt hat geklappt wenn promError= false, also kein Fehler da ist
    } catch (error) {
           console.log(error);     //wenn promError=true, (ein Fehler existiert) würde wenn hier im catch nichts steht "nothing happened ausgegeben werden, statt: "hat nicht geklappt"
    }
    console.log(prom)               // gibt in dieser Konstruktion hat geklappt aus, wenn promError= false und nothing happened wenn promError= true
}*/

async function usePromise(){
    try {
        prom = await getPromise();    //wenn es klappt, also kein fehler, resolve() und es wird weiter gemacht
        prom = await getPromise2();
        prom = await getPromise3(); 
        console.log("juhu");           //wenn alles vorher klappt indem resolve() zurückkommt, wird "juhu" ausgegebe, ansonsten bricht es vorher ab an der stelle, wo rejected wird
    } catch (xError) {
           console.error(xError);          // falls ein fehler, also promError=true irgendwo, dann bricht der code ab an der stelle wo rejected wird, (in diesem falle wird "hat nicht geklappt" zurückgegeben/rejected) und wird eingesetzt für die variable error, also auch ausgegben wegen consol.log("error"). Fehler wird also "gecatched", ansosnten würde uncaught problem angezeigt. 
    }
    console.log("ende")
}
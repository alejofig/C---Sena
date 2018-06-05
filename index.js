const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const DialogflowApp = require('actions-on-google').DialogflowApp



var verificacion;

exports.receiveAssistantRequests = functions.https.onRequest((request, response) => {

    const app = new DialogflowApp({request: request, response: response});

    let actionMap = new Map();
    actionMap.set('input.welcome', bienvenida);
    if(verificacion ===0)
    {
        app.ask(`
      No estás logueado
      `);
        response.end();

    }
    actionMap.set('infoitinerario',infoItinerario);
    actionMap.set('Numerodevuelo', agregarProblema);
    actionMap.set('infovuelos', infoVuelos);
    
    actionMap.set('infobanda', banda);
        
    
        app.handleRequest(actionMap);
        

    
    app.handleRequest(actionMap);
    
    

    function agregarProblema(app) {
//Agregar
        const device = app.getArgument('any');
        const status = app.getArgument('number');
        const lugarProblema = app.getArgument('lugar');
        var dataBaseRef = admin.database().ref(`/Problemas`).push().key;
        var date = new Date();
        var d  = date.getDate();
        var day = (d < 10) ? '0' + d : d;
        var m = date.getMonth() + 1;
        var month = (m < 10) ? '0' + m : m;
        var yy = date.getYear();
        var year = (yy < 1000) ? yy + 1900 : yy;
        var fecha = (day + "/" + month + "/" + year);
        var h = date.getHours()  ;
        h = h-5;
        var min=date.getMinutes();
        var s=date.getSeconds();
        var hora = ( h + ":" + min + ":" + s);
        var subir= {
            problema : device,
            vuelo: status,
            lugar: lugarProblema,
            hora: hora,
            fecha: fecha,
        };
       var update={};
       update['/problemas/' + dataBaseRef] = subir;
        return admin.database().ref().update(update);   
        
         //Leer vuelo    
       // const numVuelo = app.getArgument('Numdevuelo');
    }
 //   app.handleRequest(handlerRequest);

 // const actionMap = new Map('Numerodevuelo', start)

 
 function bienvenida(app) {
    email =  app.getArgument('correo');
    admin.auth().getUserByEmail(email)
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully fetched user data:", userRecord.toJSON());
        verificacion === 1;
      app.ask(`
      Bienvenido
      `);



    })
    .catch(function(error) {
      console.log("Error fetching user data:", error);
      verificacion === 0 ;
      app.ask(`
      Adios popó
      `);
    });
    
 }




 function banda(app) {
    //Consultar vuelo


    console.log("Este es tu correo", email);
    numeroDeBanda =  app.getArgument('numvueban');
    numeroDeBanda = `${numeroDeBanda}`
    var Logic = 0;
    var dataBaseRefC = admin.database().ref(`Banda/` );
    var icount = 0
    var Log = []
    
    if(numeroDeBanda === `${null}`)
    {
        console.log("Vuelo no valido")
        response.end();
    }
    let DataVerification = new Promise((resolve,reject) =>{
            console.log(`INPUT: ${numeroDeBanda}`)
            dataBaseRefC.once('value', function(snapshote) {
            snapshote.forEach(function(snap) {
            
            var F = snap.val().Vuelo
            
            Log[icount] = `${numeroDeBanda}` === F;
            //console.log(`F Type: ${typeof(F)}`)
            //console.log(`Log: ${Log[icount]}`);
            icount = icount +1;
            });
            
            for(var i = 0; i< (icount + 1); i++)
            {
                if(Log[i] === true)
                {
                    Logic = 1
                    console.log("Logic Activated");
                    
                }
            }
            setTimeout(() => {
                if(numeroDeBanda === null)
            {
                reject(Error)
            }
            else
            {
                resolve(Logic)
            }}, 500);

          
            

        });
    })
    
       
    
    
    DataVerification
        .then(response => {
            
            if(Logic === 1)
            {
            var dataBaseRefLeer = admin.database().ref(`/Banda/${numeroDeBanda}`);
            console.log("Path: ",`/Banda/${numeroDeBanda}`)
            dataBaseRefLeer.once("value", function(snapshot) {

                // var c = snapshot.child(`Itinerario/` + numeroDeVuelo).exists();
                var NoVuelo = snapshot.val().Vuelo;
                console.log(NoVuelo)

                
                //console.log(`Esta es la variable C`+ c)
                    
                    var BandaLeer = snapshot.val().Banda;
                    
                    
                        console.log(`Vuelo = " + ${NoVuelo}`);
                        console.log(`Banda = + ${BandaLeer}`);
                
                       
                        
                        app.ask(`
                        \n
                        El vuelo ${NoVuelo} llegará a la banda ${BandaLeer} \n Deseas /Agregar un problema, consultar el /Itinerario, un /Vuelo en especifico o la /Banda a donde llegará el equipaje?
                        `);
                
                

                      
            })
        }
        else
        {

          
            app.ask(`
            
            El vuelo no se encuentra en la base de datos de bandas. \n Deseas /Agregar un problema, consultar el /Itinerario, un /Vuelo en especifico o la /Banda a donde llegará el equipaje?
            `);
        }

        return 1
        }
        )
        .catch(error =>

            console.log("Error: ", Error)
        ); 
       



        }



 function infoVuelos(app) {
    //Consultar vuelo


    //var chatid = req.body.originalRequest.data.message.chat.id;
   

    sesion_code= request.body.sessionId;
    sesion_code= `${sesion_code}`
    numeroDeVuelo =  app.getArgument('InfoVuelo');
    numeroDeVuelo = `${numeroDeVuelo}`
    var Logic = 0;
    var dataBaseRefC = admin.database().ref(`Itinerario/` );
    var icount = 0
    var Log = []
    
    if(numeroDeVuelo === `${null}`)
    {
        console.log("Vuelo no valido")
        response.end();
    }
    let DataVerification = new Promise((resolve,reject) =>{
            console.log(`INPUT: ${numeroDeVuelo}`)
            dataBaseRefC.once('value', function(snapshote) {
            snapshote.forEach(function(snap) {
            
            var F = snap.val().vuelo
            
            Log[icount] = `${numeroDeVuelo}` === F;
            //console.log(`F Type: ${typeof(F)}`)
            //console.log(`Log: ${Log[icount]}`);
            icount = icount +1;
            });
            
            for(var i = 0; i< (icount + 1); i++)
            {
                if(Log[i] === true)
                {
                    Logic = 1
                    console.log("Logic Activated");
                    
                }
            }
            setTimeout(() => {
                if(numeroDeVuelo === null)
            {
                reject(Error)
            }
            else
            {
                resolve(Logic)
            }}, 500);

          
            

        });
    })
    
       
    
    
    DataVerification
        .then(response => {
            
            if(Logic === 1)
            {
            var dataBaseRefLeer = admin.database().ref(`/Itinerario/${numeroDeVuelo}`);
            console.log("Path: ",`/Itinerario/${numeroDeVuelo}`)
            dataBaseRefLeer.once("value", function(snapshot) {

                // var c = snapshot.child(`Itinerario/` + numeroDeVuelo).exists();
                var NoVuelo = snapshot.val().vuelo;
                console.log(NoVuelo)

                
                //console.log(`Esta es la variable C`+ c)
                    
                    var OrigenLeer = snapshot.val().origen;
                    var TipoLeer = snapshot.val().tipo;
                    var fechas = snapshot.val().fecha;
                    
                        console.log(`Vuelo = " + ${NoVuelo}`);
                        console.log(`Origen = " + ${OrigenLeer}`);
                        console.log(`Tipo = " + ${TipoLeer}`);
                        console.log(`Fecha = + ${fechas}`);
                
                        console.log(`Este es el codigo del usuario: ${sesion_code}`);
                        
                        app.ask(`
                        \n
                        \n
                        Vuelo: ${NoVuelo}  
                        Origen: ${OrigenLeer}  
                        Tipo : ${TipoLeer}  
                        Fecha: ${fechas} 

                        \n Deseas /Agregar un problema, consultar el /Itinerario, un /Vuelo en especifico o la /Banda a donde llegará el equipaje?
                        
                        `);
                
                

                      
            })
        }
        else
        {

            console.log(`Este es el codigo del usuario: ${sesion_code}`);
            app.ask(`
            
            El vuelo no se encuentra en nuestra base de datos.\n Deseas /Agregar un problema, consultar el /Itinerario, un /Vuelo en especifico o la /Banda a donde llegará el equipaje?
            `);
        }

        return 1
        }
        )
        .catch(error =>

            console.log("Error: ", Error)
        ); 
       



        }

      
           
   //           });    
     
        

                function infoItinerario(app) {
            
                    const tipoDeItinerario = app.getArgument('any');

        if(tipoDeItinerario ==='/Nacional'){
            var dataBaseRefLeerNacional = admin.database().ref(`/Itinerario/` );
            var Txt_nacional="";
            var Txt2_nacional="";
          
           //dataBaseRefLeer.orderByChild("tipo").on("child_added", function(snapshot) {
             // console.log(snapshot.key);
              
             dataBaseRefLeerNacional.once('value', function(snapshot) {
              snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var Fecha = childSnapshot.val().fecha
                var tipo = childSnapshot.val().tipo
                var origen = childSnapshot.val().origen
                Txt2_nacional = `
                Vuelo: ${childKey}
                Tipo: ${tipo}
                Origen: ${origen}
                Fecha: ${Fecha}\n\n`

                Txt_nacional = Txt_nacional + Txt2_nacional
                //console.log(childKey + childData)
                
              });
              app.ask(`
                NACIONAL
              Itinerario: \n${Txt_nacional} \n Deseas /Agregar un problema, consultar el /Itinerario, un /Vuelo en especifico o la /Banda a donde llegará el equipaje?
  
                      `);
            });

        }
        else if(tipoDeItinerario === '/Internacional'){


            var dataBaseRefLeerInter = admin.database().ref(`/Itinerario/` );
                      var TxtInter="";
                      var Txt2Inter="";
                    
                     //dataBaseRefLeer.orderByChild("tipo").on("child_added", function(snapshot) {
                       // console.log(snapshot.key);
                        
                       dataBaseRefLeerInter.once('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                          var childKey = childSnapshot.key;
                          var Fecha = childSnapshot.val().fecha
                          var tipo = childSnapshot.val().tipo
                          var origen = childSnapshot.val().origen
                          Txt2Inter = `
                          Vuelo: ${childKey}
                          Tipo: ${tipo}
                          Origen: ${origen}
                          Fecha: ${Fecha}\n\n`

                          TxtInter = TxtInter + Txt2Inter
                          //console.log(childKey + childData)
                          
                        });
                        app.ask(`
                            INTERNACIONAL
                        Itinerario: \n${TxtInter}  
                        
                        
                        Deseas /Agregar un problema, consultar el /Itinerario o consultar un /Vuelo en especifico?
            
                                `);
                      });

        }
                      
  
                    }

});


exports.ChangeKey = functions.https.onRequest((Request, Response) => {

    var Database = admin.database();
    var Childnum = 0;
    var Val,data;
    var Ref;
    var FlightData = [];
    var TxtOut;
    var TxtOutAnt;

    let DataVerify = new Promise((resolve,reject) =>{

        Ref = Database.ref("Itinerario/Internaciona");
        Val =  Ref.once("value",function(snapshot){
            
            data =  snapshot.forEach( function(snap) {

                console.log("F: ", snap.val());

                FlightData[0] = snap.val().Avion;
                FlightData[1] = snap.val().Banda;
                FlightData[2] = snap.val().Destino;
                FlightData[3] = snap.val().HEstSal;
                FlightData[4] = snap.val().HLlegada;
                FlightData[5] = snap.val().HSalItin;
                FlightData[6] = snap.val().Observaciones;
                FlightData[7] = snap.val().PLlegada;
                FlightData[8] = snap.val().PSalida;
                FlightData[9] = snap.val().Procedencia;
                FlightData[10] = snap.val().Sala;
                FlightData[11] = snap.val().VueloLlegando;
                FlightData[12] = snap.val().VueloSaliendo;

                Database.ref(`Itinerario/Internacional/${Childnum}`).remove();

                var NewData = {
                    Avion: FlightData[0],
                    Banda: FlightData[1],
                    Destino: FlightData[2],
                    HEstSal: FlightData[3],
                    HLlegada:FlightData[4],
                    HSalItin: FlightData[5],
                    Observaciones: FlightData[6],
                    PLlegada: FlightData[7],
                    PSalida: FlightData[8],
                    Procedencia: FlightData[9],
                    Sala: FlightData[10],
                    VueloLlegando: FlightData[11],
                    VueloSaliendo: FlightData[12]
                };
                TxtOutAnt=`
                Avion: ${FlightData[0]}\n
                Procedencia: ${FlightData[0]}\n\n`;
                TxtOut = TxtOut + TxtOutAnt;
                var Key = FlightData[11];
                
                var Update = {};
                Update['Itinerario/Internacional/' + Key] = NewData;
                Database.ref().update(Update);
                
                Childnum = Childnum + 1;
            });

            setTimeout(() => {
            
            if(Childnum > 0)
            {
                resolve("Finalizo" + TxtOut);
            }
            else
            {
                reject(Error);
            }
            }, 2000);
        });

    
    });

    
    
    DataVerify
        .then(response =>
            
            console.log(response))
        
        .catch(error =>

            console.log("Error: ", error)
        );
                
        

   
    
    Response.end();
    
});
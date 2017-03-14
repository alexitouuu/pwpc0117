//Cargar modulo http
var http = require('http');
//Cargar modulo fs
var fs = require ('fs');
//Cargar el modulo Path
//Administrar rutas
var path = require('path');
//Cargando colors
var colors = require('colors');

//Cargando configuraciones
var config = require("./config/config");

//Establecer el trema de colors
colors.setTheme(config.color_theme);

//Creando server
var server = http.createServer(function(req,res){
    //Logear peticion
    console.log(`> Peticion entrante: ${req.url}`);
    //Variable que almacena la ruta absulta del archivo hacia el servidor
    var resourcePath;
    if(req.url == "/"){
        //El cliente no especifica recurso
        //enviar a index
        resourcePath = './static/index.html';
    }
    else{
        //Posible ruta
        resourcePath = config.STATIC_PATH + req.url;
    }

    //Extrayendo la extension de la url
    var extName = path.extname(resourcePath);

    //Creando la variable content-Type
    var ContentType;

    //Asignando un Content-Type dependiendo de la extencion de la url
    
    switch (extName) {
        case '.js':
            ContentType = 'text/javascript'
            break;
        case'.css':
            ContentType = 'text/css'
            break;
        case'.html':
            ContentType = 'text/html'
            break;
        default:
            ContentType = 'text/plain'
            break;
    }
    //Todo verificar la extencion del recurso
    //callback de exist es un booleano
    fs.exists(resourcePath,function(exits){
        if(exits){
            console.log('> El recurso exite...'.info);
            //El recurso existe
            // y se intenta leer
            fs.readFile(resourcePath, function(err,content){
               // Verifico si hubo un error
               // en la lectura del archivo
               if(err){
                   console.log('> Error en lectura de recurso'.error);
                 //hubo un error
                 res.writeHead(500,{
                     'Content-Type': 'text/html'
                 });
                 res.end('<h1> 500: Error Interno </h1>');
               }else{
                   console.log(`> Se despacha recurso: ${resourcePath}`.info);
                   // No hubo error 
                   // Se envia el contenido al cliente
                   res.writeHead(200,{
                    'Content-Type': ContentType,
                    'Server' : 'ITAM@0.0.1'
                   });
                   res.end(content,'utf-8');
               }
            });

        }
        else{
            console.log('> El recurso no fue encontrado...'.info);
            //El recurso no existe
            res.writeHead(404,{
                'Content-Type' : ContentType,
                'Server' : 'ITGAM@0.0.1'
            });
            res.end('<h1>404: Not Found</h1>');
        }
    });
});

//Poniendo en ejecucion el server
server.listen(config.PORT, config.IP, function(){
    console.log(`> Server escuchando en http//${config.IP}:${config.PORT}`.info);
});
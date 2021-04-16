const Usuario = require('../models/Usuario');
const Publicacion = require('../models/Publicacion');
const PublicacionCientifica = require('../models/PublicacionCientifica'); 
const Impacto = require('../models/Impacto'); 


const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
require('dotenv').config({ path: 'variables.env' });

const crearToken = (usuario, secreta, expiresIn) => {
    console.log(usuario);
    const { id, email, nombre, departamento } = usuario;

    return jwt.sign({ id }, secreta, { expiresIn })
}

// Resolvers
const resolvers = {
    Query: {
      /*  paginatioPublicaciones (_, { skip = 0, limit }) {
            return limit ? userList.slice(skip, skip + limit) : userList.slice(skip)
          },*/
          
        obtenerUsuario: async (_, {}, ctx) => {
            return ctx.usuario;
        }, 
       
        obtenerPublicaciones: async () => {
            try {
                const publicaciones = await Publicacion.find({});
                return publicaciones;
            } catch (error) {
                console.log(error);
            }
        }, 
       
        obtenerPublicacion: async (_, { id }, ctx) => {
            // Revisar si la publicacion existe o no
            const publicacion = await Publicacion.findById(id);

            if(!publicacion) {
                throw new Error('Publicacion no encontrada');
            }

            return publicacion;
        }, 
        obtenerPublicacionesCientificas: async (_,{limite,offset}) => {
            try {
                const publicacionesCientificas = await PublicacionCientifica.find({}).limit(limite).skip(offset);
                return publicacionesCientificas;
            } catch (error) {
                console.log(error);
            }
        }, 
        //Obtener Publicacionesn Arbitrarias
        obtenerPublicaciones: async (_,{limite,offset}) => {
            try {
                const publicacionesArbitrarias = await Publicacion.find({}).limit(limite).skip(offset);
                return publicacionesArbitrarias;
            } catch (error) {
                console.log(error);
            }
        }, 
       totalPublicaciones:(root)=>{
           return new Promise((resolve,object)=>{
               PublicacionCientifica.countDocuments({},(error,count)=>{
                   if(error) reject(error)
                   else resolve(count)
               })
           })
       },
        obtenerPublicacionCientifica: async (_, { id }, ctx) => {
            // Revisar si existe o no
            const publicacionCientifica = await PublicacionCientifica.findById(id);

            if(!publicacionCientifica) {
                throw new Error('Publicacion no encontrada');
            }

            return publicacionCientifica;
        }, 
        getPublicacionesCientificas:(_,{limite,offset})=>{
            return PublicacionCientifica.find({}).limit(limite).skip(offset)
        },
        buscarPublicacion:async(_,{texto})=>{
            const publicaciones=await PublicacionCientifica.find({$text:{$search:texto}})
            return publicaciones;
        },
      
        obtenerFactorImpacto: async (_, {}, ctx) => {
            try {
                const factoresImpactos = await Impacto.find({ doi: ctx.doi.id }).populate('year');

                // console.log(pedidos);
                return factoresImpactos;
            } catch (error) {
                console.log(error);
            }
        }, 
        obtenerImpacto: async(_, {id}, ctx) => {
            // Si  existe o no
            const factorImpacto = await Impacto.findById(id);
            if(!factorImpacto) {
                throw new Error('Pedido no encontrado');
            }

            // Solo quien lo creo puede verlo
            if(factorImpacto.doi.toString() !== ctx.doi.id) {
                throw new Error('No tienes las credenciales');
            }

            // retornar el resultado
            return factorImpacto;
        }, 
      
      //  totalPublicacionesCientificas:(root)=>{
        //    return new Promise ((resolve,object)={
          //   PublicacionCientifica.countDocuments({},(error,count)=>{
            //        if(error) rejects(error)
              //      else resolve(count)
                //})
           // }) 
        // }
       // },
        analisisImpacto: async () => {
                  const factorImpacto = await PublicacionCientifica.aggregate([ 
                        {$project:{publicacion:{$year:"$creado"}}},
                //  { $match: { year : 2021 } } ,       
                    { $group : {
                        _id : {publicacion:"$publicacioncientifica"}, 
                        media: { $avg:'$factorImpacto' }                   
                    }},                
                    {
                        $sort:{media:-1}
                    }    
                      ]
                      );

            return factorImpacto;
       },
                
      // search:async(_,{search})=>{

      //  const publicacionesCientificas=await PublicacionCientifica.find({
        //    title:{$regex: search, $options:"i"},
         //   authors:{$regex: search, $options:"a"},
       // });  
       // return publicacionesCientificas     
    //}
    

    }, 
    Mutation: {
        nuevoUsuario: async (_, { input } ) => {

            const { email, password } = input;
            
            // Revisar si el usuario ya esta registrado
            const existeUsuario = await Usuario.findOne({email});
            if (existeUsuario) {
                throw new Error('El usuario ya esta registrado');
            }

            // Hashear su password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);

            try {
                 // Guardarlo en la base de datos
                const usuario = new Usuario(input);
                usuario.save(); // guardarlo
                return usuario;
            } catch (error) {
                console.log(error);
            }
        }, 
        autenticarUsuario: async (_, {input}) => {

            const { email, password } = input;

            // Si el usuario existe
            const existeUsuario = await Usuario.findOne({email});
            if (!existeUsuario) {
                throw new Error('El usuario no existe');
            }

            // Revisar si el password es correcto
            const passwordCorrecto = await bcryptjs.compare( password, existeUsuario.password );
            if(!passwordCorrecto) {
                throw new Error('El Password es Incorrecto');
            }

            // Crear el token
            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '8h' ) 
            }
            
        },
        
        nuevaPublicacion: async (_, {input}) => {
            try {
                const publicacion = new Publicacion(input);

                // almacenar en la bd
                const resultado = await publicacion.save();

                return resultado;
            } catch (error) {
                console.log(error);
            }
        }, 
        actualizarPublicacion: async (_, {id, input}) => {
            // revisar si  existe o no
            let publicacion = await Publicacion.findById(id);

            if(!publicacion) {
                throw new Error('Publicacion no encontrada');
            }

            // guardarlo en la base de datos
            publicacion = await Publicacion.findOneAndUpdate({ _id : id }, input, { new: true } );

            return publicacion;
        }, 
        eliminarPublicacion: async(_, {id}) => {
            // revisar si  existe o no
            let publicacion = await Publicacion.findById(id);

            if(!publicacion) {
                throw new Error('Publicacion no encontrada');
            }

            // Eliminar
            
            await Publicacion.findOneAndDelete({_id :  id});

            return "Registro Eliminado";
        },
        importPublicaciones:async(_,{input})=>{
            try{
                console.log("Input",input);
                var registrosInsertados=[];

                    registrosInsertados= await Promise.all( input.map (async(item,index)=>{
                    console.log("Item",item)
                    const importarCsv=new PublicacionCientifica(item);
                    const resultado=await importarCsv.save();
                      return resultado;
                }))
                console.log("RegistrosInsertados",registrosInsertados)
                return registrosInsertados
            } catch (error) {
                console.log(error);
            }
        },
        importPublicacionesArbitrarias:async(_,{input})=>{
            try{
                console.log("Input",input);
                var registrosInsertados=[];

                    registrosInsertados= await Promise.all( input.map (async(item,index)=>{
                    console.log("Item",item)
                    const importarCsv=new Publicacion(item);
                    const resultado=await importarCsv.save();
                      return resultado;
                }))
                console.log("RegistrosInsertados",registrosInsertados)
                return registrosInsertados
            } catch (error) {
                console.log(error);
            }
        },
        nuevaPublicacionCientifica: async (_, {input}) => {
            try {
                const publicacionCientifica = new PublicacionCientifica(input);

                // almacenar en la bd
                const resultado = await publicacionCientifica.save();

                return resultado;
            } catch (error) {
                console.log(error);
            }
        }, 
        actualizarPublicacionCientifica: async (_, {id, input}) => {
            // revisar si existe o no
            let publicacionCientifica = await PublicacionCientifica.findById(id);

            if(!publicacionCientifica) {
                throw new Error('Publicacion no encontrada');
            }

            // guardarlo en la base de datos
            publicacionCientifica = await PublicacionCientifica.findOneAndUpdate({ _id : id }, input, { new: true } );

            return publicacionCientifica;
        }, 
        eliminarPublicacionCientifica: async(_, {id}) => {
            // revisar si el producto existe o no
            let publicacionCientifica = await PublicacionCientifica.findById(id);

            if(!publicacionCientifica) {
                throw new Error('Publicacion no encontrada');
            }

            // Eliminar
            await PublicacionCientifica.findOneAndDelete({_id : id});

            return "Registro Eliminado";
        },
        nuevoFactorImpacto: async (_, {input}, ctx) => {

            const { doi } = input
            
            // Verificar si existe o no
            let doiExiste = await PublicacionCientifica.findById(doi);

            if(!doiExiste) {
                throw new Error('Ese doi no existe');
            }

           

            // Crear un nuevo impacto
            const nuevoFactorImpacto = new Impacto(input);
        
            // Guardarlo en la base de datos
            const resultado = await nuevoFactorImpacto.save();
            return resultado;

            
        },

    }
}

module.exports = resolvers;
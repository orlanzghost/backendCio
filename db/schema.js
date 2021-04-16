const { gql  } = require('apollo-server');

// Schema
const typeDefs = gql `

    type Usuario {
        id: ID
        nombre: String
        departamento: String
        email: String
        creado: String
    }
    
    type Token {
        token: String
    }

    type Publicacion {
        id: ID
        doi: String
        title: String
        unidad:String
        year: String
        authors: String
        revista: String
        tipoPublicacion:String
        creado:String
       
    }
    type PublicacionCientifica {
        id: ID
        doi: String
        title: String
        unidad:String
        tipoPublicacion:String
        authors:String
        year:String
        revista:String
        volumen: String
        factorImpacto:Float
        q:Int
        creado:String  
    }
    type TopImpacto{
      media:Float
      publicacion:[PublicacionCientifica!]
  }
    type ColleccionPublicaciones{
        publicaciones:[PublicacionCientifica]
    }
    type ColleccionPublicacionesArbitrarias{
        publicaciones:[Publicacion]
    }
    type importPublicacion{
      filename: String!
      mimetype: String!
      encoding: String!
   }
   type Impacto{
        id: ID
        doi:PublicacionCientifica
        factorImpacto:Float
        q:Int
    }
 

    #type Impacto {
     #  total:Float
      # factorImpacto:[PublicacionCientifica]
    #}
    input UsuarioInput {
        nombre: String!
        departamento: String!
        email: String!
        password: String!
    }

    input AutenticarInput{
        email: String!
        password: String!
    }

    input PublicacionInput {
        doi: String
        title: String
        unidad:String
        year: String
        authors: String
        revista: String    
        tipoPublicacion:String
    }
    input PublicacionCientificaInput {
        doi: String
        title: String
        unidad:String
        tipoPublicacion:String
        authors:String
        year:String
        revista:String
        volumen: String
        factorImpacto:Float
        q:Int      
    }

    input ImpactoPublicacionInput {
        id: ID
        doi:String
        factorImpacto:Float
        q:Int
    }

    type Query {
        #Usuarios
        obtenerUsuario: Usuario

        #Publicaciones
        obtenerPublicaciones(limite:Int,offset:Int): [Publicacion]
        obtenerPublicacion(id: ID!): Publicacion

        #PublicacionesCientificas
        obtenerPublicacionesCientificas(limite:Int,offset:Int): [PublicacionCientifica]
        obtenerPublicacionCientifica(id: ID!): PublicacionCientifica
        search(search:String):[PublicacionCientifica]
        uploads: [importPublicacion]
        totalPublicaciones:String
        paginatioPublicaciones(skip: Int, limit: Int): [PublicacionCientifica]


         # Impacto
        obtenerFactorImpacto: [Impacto]
        obtenerImpacto(id: ID!) : Impacto


        #Paginación
        getPublicacionesCientificas(limite:Int,offset:Int):[PublicacionCientifica]

        #SEARCH
        buscarPublicacion(texto:String!):[PublicacionCientifica]

        # Busquedas Avanzadas
        analisisImpacto:[TopImpacto]
    }

    type Mutation {
        # Usuarios
        nuevoUsuario(input: UsuarioInput) : Usuario
        autenticarUsuario(input: AutenticarInput) : Token

        # Publicacion
        nuevaPublicacion(input: PublicacionInput) : Publicacion
        actualizarPublicacion(id: ID!, input: PublicacionInput): Publicacion
        eliminarPublicacion(id: ID!) : String
        importPublicacionesArbitrarias(input: [PublicacionInput]): [Publicacion]

        
       # PublicacionCientifica
        nuevaPublicacionCientifica(input: PublicacionCientificaInput) : PublicacionCientifica
        actualizarPublicacionCientifica(id: ID!, input: PublicacionCientificaInput): PublicacionCientifica
        eliminarPublicacionCientifica(id: ID!) : String
        importPublicaciones(input: [PublicacionCientificaInput]): [PublicacionCientifica]
         # Factor Impacto
         nuevoFactorImpacto(input: ImpactoPublicacionInput): Impacto
         eliminarImpacto(id: ID!) : String

        
    }
`;
module.exports = typeDefs;
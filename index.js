const express = require("express")
const app = express()

const CategoriesController = require("./categories/CategoriesController")
const ArticlesController = require("./articles/ArticlesController")
const UsersController = require("./user/UserController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./user/User")


const connection = require("./database/database")


app.set("view engine", "ejs")

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static("public"))

connection.authenticate().then(()=> {
    console.log("Banco de dados conectado")
}).catch((err)=> {
    console.log("Erro ao conectar")
})
 
app.use("/", CategoriesController)
app.use("/", ArticlesController)
app.use("/", UsersController)

app.get("/", (req,res)=> {
    Article.findAll({order: [["id", "desc"]],limit: 4}).then((articles)=> {
        Category.findAll().then((categories)=> {
            res.render("index", {articles: articles, categories: categories})
        })
       
    })
    
})

app.get("/:slug",(req,res)=> {
    let slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then((article)=> {
        if(article != undefined){
            Category.findAll().then((categories)=> {
                res.render("article", {article: article, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch((err)=> {
        res.redirect("/")
    })
})

app.get("/category/:slug",(req,res)=> {
    let slug = req.params.slug

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}] // incluir todas os artigos dessa categorira
    }).then((category)=> {
        if(category != undefined){
            Category.findAll().then((categories)=> {
                res.render("index", {articles: category.articles, categories: categories})
            })

        }else {
            res.redirect("/")
        }
    })
})

app.listen(8080, ()=> {
    console.log("Server is running")
})
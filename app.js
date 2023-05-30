require('dotenv').config()
const express = require("express");
const bodyparser = require("body-parser");
const { getData } = require("./data");
const mongoose = require("mongoose");
const date = require(__dirname+"/data.js");
const _ = require("lodash");
const { name } = require("ejs");



const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"))

//to use code inside a html file you will need to use the command <% inside all the pieces of code that you write in you
//code like you want do separata a variable of a text in javaScript%>

mongoose.connect("mongodb+srv://"+process.env.API_KEY+"/todolistDB")

// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")
const itemsSchema ={
    name: String
}
const Item = mongoose.model("Item", itemsSchema);

const Cofee = new Item({
    name:"Cofee"
})
const Milk = new Item({
    name:"Milk"
})
const Eggs = new Item({
    name:"Eggs"
})
const myItems = [Cofee, Milk, Eggs];


const listSchema={
    name:String,
    items:[itemsSchema] 
  };

const List = mongoose.model("List", listSchema);


app.get("/", function (req, res) {
    //using the function data that we've created past is like using a npm module
    let day = date.getData()
    Item.find().then(function (items) {
        if(items.length === 0){
            Item.insertMany(myItems);
            res.redirect("/")
            
        }else{
        res.render("list", { listTitle: "home", items: items});
        
        console.log(items.length)
        }}); 
        
    
        
})


app.post("/", function (req, res) {
   const listName = req.body.list
   const lista = (req.body.newNote);
   const itemName = new Item({
    name: lista
})

    if (listName === "home") {

        itemName.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}).then(function(foundList){
            foundList.items.push(itemName);
            foundList.save();
            res.redirect("/"+ listName);
        })
        
       
    }

})

app.post("/delete", function(req, res){
 
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
   
    if(listName === "home") {
   
      Item.findByIdAndRemove(checkedItemId).then(function(foundItem){Item.deleteOne({_id: checkedItemId})})
   
      res.redirect("/");
   
    } else {
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).then(function (foundList)
        {
          res.redirect("/" + listName);
        });
    }
   
  });
    



app.get("/:customListName", function(req, res){

    const customListName = _.lowerCase(req.params.customListName)
    List.findOne({name: customListName})
    .then(function(foundList){
        if(!foundList){
            const list = new List({
              name:customListName,
              items:myItems
            });
          
            list.save();
            console.log("saved");
            res.redirect("/"+customListName);
          }else{
            console.log("match found"+ foundList.name)
            console.log(foundList.items)
            

            res.render("list", { listTitle: foundList.name, items: foundList.items});   
        }
    }).catch(function(err){});
})

app.listen(process.env.PORT || 3000, function () { 
    console.log("Server started.");
     }); 




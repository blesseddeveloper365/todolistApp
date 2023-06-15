const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");

var today = new Date();
var currentDay = today.getDay();
var day = "";

var option = {weekday: 'long', month: 'long', day: 'numeric'};

const date = today.toLocaleDateString("en-US", option);

// var items = ["Buy Food", "Cook Food", "Eat Food"];
// let workitems = [];

mongoose.connect("mongodb+srv://fullbd365_1:&$!Mike2020@blesseddeveloper0.i2diiqp.mongodb.net/todolistDB");

const itemsSchema = {
  name:{ type: String, required: true }
  // rating:{ type: Number, min:1, max:10 },
  // review:String
};

const Item = mongoose.model ("Item", itemsSchema) ;   


const item1 = new Item({
  name:"Welcome to your todolist"
});
const item2 = new Item({
  name:"Hit the + to add a new item"
});
const item3 = new Item({
  name:"Hit this <-- to deletean item"
});

const defaultItems = [item1, item2, item3];


const listSchema = {
name: String,
items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);



// Item.deleteMany({ name: { $in:  ['Welcome to your todolist', 'Hit the + to add a new item', 'Hit this <-- to deletean item'] } })
//  .then(function () {
//     console.log("Successfully Deleted");
//   })
//   .catch(function (err) {
//     console.log(err);
//   });


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", async function(req, res){
  
  const shwdeflt = await Item.find();
  if(shwdeflt.length === 0){
Item.insertMany(defaultItems)
.then(function () {
  console.log("Successfully saved defult items to DB");
})
.catch(function (err) {
  console.log(err);
});

res.redirect("/");

  } else{

   
res.render("list", {listTitle: date, listitems: shwdeflt});
  }

});



app.get("/:CustomList", function(req, res){
const CustomList = _.capitalize(req.params.CustomList);

List.findOne({name: CustomList })
 .then((foundList)=>{
  res.render("list", {listTitle: foundList.name, listitems: foundList.items});
 })
 .catch((err)=>{
     const list = new List({
      name: CustomList,
      items: defaultItems
      });
      
      list.save();
      res.redirect("/" + CustomList);
 });


});



app.post("/", function(req, res){
const newItem = req.body.addtolist; 
const listTitle = req.body.listb;
const item = new Item({
  name: newItem
});

if(listTitle === date){
  item.save();
  res.redirect("/");

}else {
  
  List.findOne({name: listTitle })
  .then((foundList)=>{
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listTitle )
  })
  .catch((err)=>{
      console.log(err);
  });

}



// if(req.body.listb === "Work Items"){
//   workitems.push(item);
//   res.redirect("/work");
// } else{
//   items.push(item);
//   res.redirect("/");
// }


});




app.post("/delete", function(req, res){
  const checkedItem = req.body.checkbox;
  const dltCate = req.body.dltCate;
  

  if(dltCate === date){
    Item.findByIdAndRemove({ _id: checkedItem }).then(function() {
      console.log("Removed successfully!");
    }).catch(function(err) {
      console.log(err);
    });
  
    res.redirect("/");
  }else{

List.findOneAndUpdate({name: dltCate}, {$pull: {items: {_id: checkedItem}}}).then(function() {
  res.redirect("/" + dltCate);
}).catch(function(err) {
  console.log(err);
});
  }


  });



// app.get("/work", function(req, res){
//   res.render("list", {listTitle: "Work Items", listitems: workitems});
// });




// app.post("/work", function(req, res){
//   item = req.body.addtolist;
//   workitems.push(item);
//   res.redirect("/work");
// });

app.listen(3650, function(){
  console.log("Welcome to BlessedDeveloper365 Server");
})

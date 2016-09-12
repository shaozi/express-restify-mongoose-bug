/* jshint node:true */
/* global require */
const assert = require("assert")
const winston = require("winston")

const express = require("express")
const app = express()
const server = require("http").Server(app)
const restify = require("express-restify-mongoose")
const router = express.Router()
const methodOverride = require("method-override")

const mongoose = require("mongoose")
const models = require("./models.js")

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/test")

// used by restify
app.use(methodOverride())

restify.defaults({lean: false})
restify.serve(router, models.Child)
//restify.serve(router, models.Parent)

restify.serve(router, models.Parent, {
  postRead: function(req, res, next) {
    req.erm.result.populate('child').execPopulate().then((result) => {
      // req.erm.result is now fully populated
      winston.info("Result is :", result)
      next()
    }).catch(next)
  }
})

app.use(router)

// Main
server.listen(3000, "127.0.0.1");
winston.info("server started on 3000")


// init db and create parent and Child
models.Child.findOneAndUpdate({name:"aaa"}, {name:"aaa"}, {upsert: true},
function(err){
  assert(err === null)
  models.Child.findOne({name:"aaa"}, function(err, child){
    assert(err === null && child !== null)
    models.Parent.findOneAndUpdate({name:"AAA"}, {name:"AAA", child:child._id}, {upsert: true},
      function(err) {
        assert(err === null)
        models.Parent.findOne({name:"AAA"}).populate("child")
        .exec(function(err, parent){
          assert(err === null && parent !== null)
          winston.info("Parent is ", parent.name, ", child is ", parent.child.name)
        })
      })
  })  
})


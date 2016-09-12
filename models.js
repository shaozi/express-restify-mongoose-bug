var mongoose = require('mongoose')

var childSchema = mongoose.Schema({
  name: String
})
var Child = mongoose.model('Child', childSchema)

var parentSchema = mongoose.Schema({
  name: String,
  child: { type: mongoose.Schema.Types.ObjectId, ref: 'Child'}
})
var Parent = mongoose.model('Parent', parentSchema)

var models = {
  Child: Child,
  Parent: Parent
}

module.exports = models
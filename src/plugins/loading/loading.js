var UIObject = require('../../base/ui_object')
var _ = require('underscore')

var defaultImage = "data:image/gif;base64,R0lGODlhGQAZAPMAAP////f39+/v7+bm5t7e3tbW1szMzMXFxb29vbW1ta2traWlpZmZmYyMjISEhHNzcyH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCAAQACwAAAAAGQAZAAAFjCAkjiTkPE6pqssyPvBIECu5MIwLwY881yMcQ8QTzX5AiNBVPNJWiUQQt4sdSU9IQsEV3XA8p/Gq5XKlOB3k6kSKzN1aOzvaxldiYBToHhX+gAVJa3OBgINzBIZ/iHMqfSWQkWR4lFh5lZiOlGxtY0iJeZpZnTSWdJc/paiZn5+sqU+ckpM+pLBJlishACH5BAUIABAALAAAAAAUAA4AAAVRICSOJLQwS6lCSTIy8Og4aqIoLgQz4/PQpZtCtBP5fiqhq+g4jgqEkVAXc4oK2ILIhts1fc8sFnLLQb4qsXbFFrPfkDEcQqjbo3P6vZ7X7/shACH5BAUIABAALAEAAAAXAAsAAAVQICSOZKIkZKoSxai847KoY2G30KuMDDPTkJtIJ+r5gEEhcWFckZSw5sgBIVgJoltBx+yJHI+H43pN4iBdCDgsFpGxQHaYOiIj2fQVnAZOhQAAIfkEBQgAEAAsBQAAABQADgAABUogJI5FOZ4oRJCmmCQpIa9QWYyKAqOzaIs5Xaz3SwRTIqLpOFqcZgSbUQhhWJ2jnisHWVivyNQXHEaNy0gvuvxoux1rkXseh8zdIQAh+QQFCAAQACwLAAAADgAUAAAFSyAhQmRpQiJRFsWJjiTbmmksn7U80+NdJqSUjpRQKIArFqRoPLogTSPS1Zw+i08XY8tdPLngL3jrcjyypofagYao3+ysGd6mtyHxEAAh+QQFCAAQACwOAAEACwAXAAAFTiAkEoRonmR5jukKperamgVLikVetnlf074fMOeCEIsihXKZOC2fzqeiKVowkBCGdlHUerkQx+MBsX7DY4foDBmTTWD0GOlWF9NIh/0UAgAh+QQFCAAQACwLAAUADgAUAAAFTiAkjiRElCihoqPqnukLxysr1vZY7HzB9rwf0FdKJHIjhfKYUzqZowWDAUk4FceHVspYiJ4Q7QMypY6YYgjXTEqTp962dgQvudVx+RgZAgAh+QQFCAAQACwFAAsAFAAOAAAFUSAkjuRInChRrmKKsqt7wmRR0LRt46uul4+HY5RQKCC+ncgRfDCeRUVC5Bs1IU8GxHgc3ZbBYRYSna6u2KeIax4xhaLxWrpyDONqUaJNW+RpIQAh+QQFCAAQACwBAA4AFwALAAAFUiAkio4zniJBoKPzvOyoquhrx+lMu/YDMYzFqECE6FQ8H2QBZCiexKJxBimNmpCnAhI9rVBNRvbJ7eJ+QJFWFP2ymEE1mS2NLYTyLf3MSigSfCEAIfkEBQgAEAAsAAALABQADgAABU6g84wkZJ7oSa5pa66lK5/LMrsLo9+p7vOmnI8BUSgSJ4ISJSRCEkZFYapc0mymKGRagFRl0ON26v22tONumTBIhZHppBWVgMdN8xm3FQIAIfkEBQgAEAAsAAAFAA4AFAAABUsgBDmOaJ6i86woqq5P2ZowO6fwfZLtwvzAGXAoHP50p0QCmVA4dc7orBldFq5JKeR6JXhFShMX4iW0uAXyFzVWm09oUfmclq915RAAIfkECQgAEAAsAAAAABkAGQAABVwgJI5kaZ6j46Bs6TzP2s7wM9OwfI/LMtY7HmMoesGCkMVw6MshRUvik6SUTqm+Z0LB7V674OsWrLiaCgWzCI1Ws9vTd5tAR75F9Lo9jdeb8wRqEHmCgIKDgYdmIQA7"

class Loading extends UIObject {
  get template() { return _.template('<img src=<%= base64Image %> <h3> <%= message %> </h3>') }
  get defaultImage() { return defaultImage }

  initialize(options) {
    this.message = options.message || ''
    this.base64Image = options.base64Image || this.defaultImage
    this.customStyle = options.style || {}
  }

  show() {
    return this.$el.show().promise()
  }

  hide() {
    return this.$el.hide().promise()
  }

  render() {
    this.$el.css(this.customStyle)
    this.$el.html(this.template({base64Image: this.base64Image, message: this.message}))
    this.$el.hide()
    return this
  }
}

module.exports = Loading

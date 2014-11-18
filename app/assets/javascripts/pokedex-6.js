Pokedex.Router = Backbone.Router.extend({
  routes: {
    "": "pokemonIndex",
    "pokemon/:pokemonId/toys/:toyId": "toyDetail",
    "pokemon/:id": "pokemonDetail"
  },
  
  initialize: function () {
  },
  
  pokemonDetail: function (id, callback) {
    if(!this._pokemonIndex){
      this.pokemonIndex(function () {
        this.pokemonDetail(id, callback)
      }.bind(this));
    } else {
      var pokemon = this._pokemonIndex.collection.get(id);
      if (pokemon){
        this._pokemonDetailView = new Pokedex.Views.PokemonDetail({
          model: pokemon
        })
        this._pokemonDetailView.refreshPokemon(callback);
      } else {
        this._pokemonIndex.collection.fetch({
          success: function(){
            pokemon = this._pokemonIndex.collection.get(id);
            this._pokemonDetailView = new Pokedex.Views.PokemonDetail({
              model: pokemon
            })
            this._pokemonDetailView.refreshPokemon(callback);
          }.bind(this)
        })
      }
    }
  },

  pokemonIndex: function (callback) {
    this._pokemonIndex = new window.Pokedex.Views.PokemonIndex();
    this._pokemonIndex.refreshPokemon(callback);
    $("#pokedex .pokemon-list").html(this._pokemonIndex.$el);   
    var pokemonNew = new window.Pokedex.Views.NewForm();
    $("div.pokemon-index").prepend(pokemonNew.render().$el)
  },

  toyDetail: function (pokemonId, toyId) {
    if(!this._pokemonDetailView) {
      this.pokemonDetail(pokemonId, function () {
        this.toyDetail(pokemonId, toyId);
      }.bind(this));
    } else {
      var pokemon = this._pokemonDetailView.model
      var toy = pokemon.toys().get(toyId)
      var toyDetail = new Pokedex.Views.ToyDetail({
        collection: this._pokemonIndex.collection,
        model: toy
      });
      $("div.toy-detail").html(toyDetail.render().$el)
    }
  }
});


$(function () {
  new Pokedex.Router();
  Backbone.history.start();
});


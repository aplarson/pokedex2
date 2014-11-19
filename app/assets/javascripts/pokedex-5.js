Pokedex.Views = {}

Pokedex.Views.PokemonIndex = Backbone.View.extend({
  events: {
  },
  selectPokemonFromList: function (event) {
  }
});

window.Pokedex.Views.PokemonIndex = Backbone.View.extend({
  events: {
    "click li": "selectPokemonFromList"
  },
  
  selectPokemonFromList: function (event) {
    // Phase IB
    var $target = $(event.target);
    var pokeId = $target.data('id');
    Backbone.history.navigate('/pokemon/' + pokeId, { trigger: true })

  },
  
  initialize: function(options){
    this.collection = new Pokedex.Collections.Pokemon([]);
  },
  
  refreshPokemon: function(callback){
    this.collection.fetch({
      success: function(){
        this.render()
        callback && callback()
      }.bind(this)
    })
  },
  
  addPokemonToList: function (pokemon) {
    var templateFn = JST["pokemonListItem"];
    var renderedTemplate = templateFn({
      pokemon: pokemon
    })
    this.$el.append(renderedTemplate)
  },
  
  render: function(){
    this.$el.empty()
    this.collection.each(function(pokemon){
      this.addPokemonToList(pokemon)
    }.bind(this))
  }
})


Pokedex.Views.PokemonDetail = Backbone.View.extend({
  initialize: function () {
    this.state = "closed"
  },
  
  events: {
    "click .toys li": "selectToyFromList",
    "dblclick div.detail": "openEditForm",
    "submit form": "submitEditForm",
    "click button.upload-image": "uploadPicture"
  },
  
  uploadPicture: function(event){
    event.preventDefault()
    filepicker.setKey("AdhYP1fGTQ0ChKxAyNoa7z");

    filepicker.pick(
      function(Blob){
        this.$("input#pokemon_image_url").val(Blob.url)
        this.$("img").attr("src", Blob.url)
      }
    );
    
    
  },
  

  refreshPokemon: function (callback) {
    this.model.fetch({
      success: (function () {
        $("div.pokemon-detail").html(this.render().$el);
        callback && callback();
      }).bind(this)
    });
  },

  render: function () {
    if (this.state === "open") {
      var templateFn = JST["pokemonEditDetail"]
    } else {
      var templateFn = JST["pokemonDetail"]
    }
    var renderedTemplate = templateFn({
      pokemon: this.model
    })
    this.$el.html(renderedTemplate);
   
    var toys = this.model.toys();
    var toyTemplateFn = JST["toyListItem"];
    
    toys.each(function (toy) {
      var renderedToyTemplate = toyTemplateFn({
        toy: toy
      })
      this.$el.find(".toys").append(renderedToyTemplate);
    }.bind(this))
    
    return this
  },

  selectToyFromList: function (event) {
    var $target = $(event.target);

    var toyId = $target.data('id');
    
    Backbone.history.navigate("/pokemon/" + this.model.id + "/toys/" + toyId, {trigger: true})
  },
  
  openEditForm: function (event) {
    this.state = "open";
    this.render();
  },
  
  submitEditForm: function (event) {
    event.preventDefault();
    var pokeParams = $(event.currentTarget).serializeJSON()["pokemon"];
    pokeParams["moves"] = pokeParams["moves"].split(",");
    this.model.set(pokeParams);
    this.model.save({}, {
      success: function () {
        this.state="closed"
        this.render();
      }.bind(this)
    })

  }
});

Pokedex.Views.NewForm = Backbone.View.extend({
  events: {
    "submit form": "newPokemon",
    "click button.picture": "runFilePicker"
  },
  runFilePicker: function(event){
    event.preventDefault();
    filepicker.setKey("AdhYP1fGTQ0ChKxAyNoa7z");

    filepicker.pick(
      function(Blob){
        this.$("#pokemon_image_url").val(Blob.url)
        this.$("div.image-preview").html("<img src=\"" + Blob.url + "\">")
      }
    );
  },
  
  newPokemon: function(event){
    event.preventDefault();
    var pokeParams = $(event.currentTarget).serializeJSON();
    var pokemon = new Pokedex.Models.Pokemon(pokeParams)
    pokemon.save({},{
      success: function (resp) {
        this.render();
        Backbone.history.navigate("/pokemon/" + resp.id, { trigger: true });
      }.bind(this)
    })
  },
  render: function(){
    var content = $("script#new-pokemon-form").html();
    this.$el.html(content)
    
    return this
  }
})

Pokedex.Views.ToyDetail = Backbone.View.extend({
  render: function () {
    var templateFn = JST["toyDetail"];

    var renderedTemplate = templateFn({
      pokes: this.collection,
      toy: this.model
    })///ERRORR HEREEE
    
    this.$el.html(renderedTemplate)
    return this
  },
  events: {
    "change select": "reassign"
  }, 
  reassign: function(event){
    var $currentTarget = $(event.currentTarget)
    var pokemon = this.collection.get($currentTarget.data("pokemon-id"));
    var toy = pokemon.toys().get($currentTarget.data("toy-id"));
    
    toy.set("pokemon_id", $currentTarget.val());
    
    toy.save({}, {
      success: (function () {
        pokemon.toys().remove(toy);
        $("div.toy-detail").empty();
        Backbone.history.navigate("/pokemon/" + pokemon.id, {trigger: true})
      }).bind(this)
    });
  }
});





// $(function () {
//   var pokemonIndex = new Pokedex.Views.PokemonIndex();
//   pokemonIndex.refreshPokemon();
//
//   $("#pokedex .pokemon-list").html(pokemonIndex.$el);
// });


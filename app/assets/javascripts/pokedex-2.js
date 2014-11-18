Pokedex.RootView.prototype.addToyToList = function (toy) {
  var scriptContent = $("script#toy-list-item-template").html();
  var templateFn = _.template(scriptContent);
  var renderedTemplate = templateFn({
    toy: toy
  })
  
  this.$pokeDetail.find(".toys").append(renderedTemplate);
};

Pokedex.RootView.prototype.renderToyDetail = function (toy) { // III
  this.$toyDetail.empty();

  var scriptContent = $("script#toy-detail-template").html();
  var templateFn = _.template(scriptContent);
  var renderedTemplate = templateFn({
    pokes: this.pokes,
    toy: toy
  })

  this.$toyDetail.html(renderedTemplate);
};

Pokedex.RootView.prototype.selectToyFromList = function (event) {
  var $target = $(event.target);

  var toyId = $target.data('id');
  var pokemonId = $target.data('pokemon-id');

  var pokemon = this.pokes.get(pokemonId);
  var toy = pokemon.toys().get(toyId);

  this.renderToyDetail(toy);
};

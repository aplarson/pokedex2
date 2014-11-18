Pokedex.RootView.prototype.renderPokemonDetail = function (pokemon) {
  var scriptContent = $("script#pokemon-detail-template").html();
  var templateFn = _.template(scriptContent);
  var renderedTemplate = templateFn({
    pokemon: pokemon
  })
  
  this.$pokeDetail.html(renderedTemplate);

  // Phase 2C.

  pokemon.fetch({
    success: (function() {
      this.renderToysList(pokemon.toys());
    }).bind(this)
  });
};

Pokedex.RootView.prototype.selectPokemonFromList = function (event) {
  // Phase II

};

Pokedex.RootView.prototype.addPokemonToList = function (pokemon) {
};

Pokedex.RootView.prototype.refreshPokemon = function (callback) {
  this.pokes.fetch({
    success: (function () {
      this.$pokeList.empty();
      this.pokes.each(this.addPokemonToList.bind(this));
      callback && callback();
    }).bind(this)
  });

  return this.pokes;
};

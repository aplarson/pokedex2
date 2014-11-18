Pokedex.RootView.prototype.reassignToy = function (event) {
  
};

Pokedex.RootView.prototype.renderToysList = function (toys) {
  this.$pokeDetail.find(".toys").empty();
  toys.each((function(toy) {
    this.addToyToList(toy);
  }).bind(this));
};

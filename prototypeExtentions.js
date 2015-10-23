(function() {
	
	var _protoTypeChain = "__protoTypeChain__",
		_className = "__className__";

	// caching recursive function that returns an array containing the prototype chain
	function getChain (obj) {
		var newArray;

		if(! obj.hasOwnProperty(_protoTypeChain)){
			newArray = [obj];
			if (obj.constructor.__super__) {
				obj[_protoTypeChain] = newArray.concat(getChain(obj.constructor.__super__));
			}else{
				obj[_protoTypeChain] = newArray;
			}
		}
		return obj[_protoTypeChain];
	}
	function getWithOwnProp (obj, prop) {
		return _.filter(getChain(obj), function(link) {
			return link.constructor.prototype.hasOwnProperty(prop);
		});
	}
	function getOwnProp (obj, prop) {
		return _.pluck(getWithOwnProp(obj, prop),prop );
	}

	Marionette.View.prototype.className = function() {
		var proto = this.constructor.prototype;
		if(! proto[_className] ){
			proto[_className] = getOwnProp(proto, "appendClassName").join(" ");
		}
		return proto[_className];
	}


})();

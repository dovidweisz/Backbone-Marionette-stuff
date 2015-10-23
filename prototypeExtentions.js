(function() {
	// create hash for hidden properties
	// extending the prototypes is dangerous work so we keep everything private
	var _hiddenHash = {},
		SECRET_HASH_NAME = "__" + uuid() + "__";

	// this is the lock and key for out private varibles (a variation of https://github.com/dovidweisz/tunaBagel/blob/master/tuna/utils/Private.js)
	function _hidden (obj) {
		if(!obj.hasOwnProperty(SECRET_HASH_NAME)){
			var name = uuid();
			_hiddenHash[name] = {};
			obj[SECRET_HASH_NAME] = name;
		}
		return _hiddenHash[obj[SECRET_HASH_NAME]];
	}

	// caching recursive function that returns an array containing the prototype chain
	function getChain (obj) {
		var _obj = _hidden(obj),
			newArray;

		if(! _obj.protoTypeChain){
			newArray = [obj];
			if (obj.constructor.__super__) {
				_obj.protoTypeChain = newArray.concat(getChain(obj.constructor.__super__));
			}else{
				_obj.protoTypeChain = newArray;
			}
		}
		return _obj.protoTypeChain;
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
		var proto = this.constructor.prototype,
			_proto = _hidden(proto);
		if(! _proto.className ){
			_proto.className = getOwnProp(proto, "appendClassName").join(" ");
		}
		return _proto.className;
	}

	// Unique Universal ID generator copied from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	function uuid () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	}
})();

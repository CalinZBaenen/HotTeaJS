
let Class = function Class(description=null) {
	if(typeof description !== "object" || description === null) {
		description = {};
	}
	classInstance = function classInstance() {
		const base = {};
		let publicItems = description.public || {};
		for(const item of Object.keys(publicItems)) {
			base[item] = publicItems[item];
		}
		base.$constructorMethod = Literal;
		base.$root = Class.symbol;
		base.$name = (
			typeof description.name === "string" &&
			description.name.lenth >= 1 ?
			description.name :
			"$CLASS$"
		);
		return base;
	};
	let statics = description.static || {};
	let Literal = function Literal(...args) {
		let CONSTRUCTOR = description.constructor;
		let varinput = {};
		if(typeof CONSTRUCTOR === "function") {
			varinput = CONSTRUCTOR(...args);
		}
		const instance = classInstance();
		for(const s of Object.keys(Literal)) {
			if(
				typeof Literal[s] !== "function"
			) instance[s] = Literal[s];
		}
		if(typeof varinput === "object") {
			for(const v of Object.keys(varinput)) {
				instance[v] = varinput[v];
			}
		}
		instance.$role = "instance";
		return Object.seal(instance);
	};
	Literal.$name = (
		typeof description.name === "string" &&
		description.name.length >= 1 ?
		description.name :
		"$CLASS$"
	);
	Literal.name = Literal.$name;
	Literal.$role = "class";
	Literal.$root = Class.symbol;
	for(const s of Object.keys(statics)) Literal[s] = statics[s];
	return Object.seal(Literal);
};

Class.symbol = Symbol("class");

Class.createTag = function(className="$CLASS$") {
	return Symbol(String(className));
};

Class.call = function(classObject=null) {
	if(
		typeof classObject === "object" ||
		classObject !== null ||
		classObject.$root === Class.symbol
	) {
		try {
			return classObject.$constructorMethod();
		} catch(E) {
			return null;
		}
	}
	return null;
};

Class.isClassObject = function(object=undefined) {
	if(
		(
			typeof object === "object" ||
			typeof object === "function"
		) &&
		object !== null
	) {
		return (
			typeof object.$name === "string" &&
			object.$name.length >= 1 &&
			typeof object.$role === "string" &&
			(
				object.$role === "class" ||
				object.$role === "instance"
			) &&
			Object.isSealed(object) &&
			typeof object.$root === "symbol" &&
			object.$root === Class.symbol
		);
	}
	return false;
};

Class.isClass = function(object=undefined) {
	if(Class.isClassObject(object)) {
		return (
			object.$role === "class" &&
			typeof object === "function" &&
			object.name === "Literal"
		);
	}
	return false;
};

Class.isInstance = function(object=undefined) {
	if(Class.isClassObject(object)) {
		return (
			object.$role === "instance" &&
			typeof object.$constructorMethod === "function" &&
			Class.isClass(object.$constructorMethod) &&
			!Class.isClass(object)
		);
	}
};

Class.meta = Class;

Class.examples = {
	Identity: Class({
		static: {
			id: 0,
			createID: function() {
				this.id = Math.round(Math.random()*10000);
				return this.id;
			}
		},
		constructor: function(id=0) {
			return {id: id};
		},
		name: "Identity"
	}),
	Person: Class({
		constructor: function(name="Calin",age=13,sex="male") {
			return {name: name, age: age, sex: sex};
		},
		name: "Person"
	})
};

Object.freeze(Class.examples);

Object.freeze(Class);

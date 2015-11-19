/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

var Deferral = function() {
  
}

var $Promise = function() {
  this.state = 'pending';
  this.handlerGroups = [];
}

var defer = function() {
  var newDeferral = new Deferral();
  newDeferral.$promise = new $Promise();
  
  return newDeferral;
}

Deferral.prototype.resolve = function(value) {
  if (this.$promise.state === 'pending') {
    this.$promise.state = 'resolved';
    this.$promise.value = value;
    this.$promise.callHandlers();
  }
}

Deferral.prototype.reject = function(reason) {
  if (this.$promise.state === 'pending') {
    this.$promise.state = 'rejected';
    this.$promise.value = reason;
    this.$promise.callHandlers();
  }
}

$Promise.prototype.then = function (successCb, errorCb){
  if (typeof successCb !== 'function')
    successCb = undefined;
  if (typeof errorCb !== 'function')
    errorCb = undefined;
  this.handlerGroups.push({ successCb: successCb, errorCb: errorCb });
  if(this.state !== 'pending')
    this.callHandlers()
}
$Promise.prototype.callHandlers = function() {
  var cbValue = this.value
  if (this.state === 'resolved'){
    this.handlerGroups.forEach(function(callBacks){
      callBacks.successCb(cbValue);
      })
    }
  if (this.state === 'rejected'){
    this.handlerGroups.forEach(function(callBacks){
      callBacks.errorCb(cbValue);
      })
  }
  this.handlerGroups = [];
};


/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/

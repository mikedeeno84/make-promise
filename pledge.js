/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

var Deferral = function() {
  
}

var $Promise = function(oldPromise) {
  if (oldPromise.state)
    this.state = oldPromise.state
  else this.state = 'pending';

  if (oldPromise.handlerGroups)
    this.handlerGroups = oldPromise.handlerGroups
  else this.handlerGroups = [];
}

var defer = function() {
  var newDeferral = new Deferral();
  newDeferral.$promise = new $Promise({});
  
  return newDeferral;
}

Deferral.prototype.resolve = function(value) {
  if (this.$promise.state === 'pending') {
    this.$promise.state = 'resolved';
    this.$promise.value = value;
    var resolveValue = this.$promise.value;
    this.$promise.handlerGroups
      .forEach(function(group){
        group.forwarder.resolve(resolveValue)
      })
    this.$promise.callHandlers();
  }
}

Deferral.prototype.reject = function(reason) {
  if (this.$promise.state === 'pending') {
    this.$promise.state = 'rejected';
    this.$promise.value = reason;
    var rejectValue = this.$promise.value;
    this.$promise.handlerGroups
      .forEach(function(group){
        if (group.successCb)
          group.forwarder.resolve(rejectValue)
        else if (group.errorCb)
          group.forwarder.resolve(rejectValue)
        else
          group.forwarder.reject(rejectValue)
      });
    this.$promise.callHandlers();
  }
}

$Promise.prototype.then = function (successCb, errorCb){
  if (typeof successCb !== 'function')
    successCb = undefined;
  if (typeof errorCb !== 'function')
    errorCb = undefined;
  var forwarder = defer()
  this.handlerGroups.push({ successCb: successCb, errorCb: errorCb, forwarder: forwarder });
  if(this.state !== 'pending')
    this.callHandlers()
  return forwarder.$promise;
}
$Promise.prototype.callHandlers = function() {
  var cbValue = this.value
  var currentPromise = this
  if (this.state === 'resolved'){
    this.handlerGroups.forEach(function(callBacks){
      if (callBacks.successCb){ 
        try {callBacks.forwarder.$promise.value = callBacks.successCb(cbValue); }
        catch(err) {
          callBacks.forwarder.$promise.state = "rejected"
          callBacks.forwarder.$promise.value = err;
          callBacks.forwarder.reject(err)

        }
          }
      })
    }
  if (this.state === 'rejected'){
    this.handlerGroups.forEach(function(callBacks){
      if (callBacks.errorCb) {
        try {callBacks.forwarder.$promise.value = callBacks.errorCb(cbValue);}
        catch(err) {
          callBacks.forwarder.$promise.state = "rejected"
          callBacks.forwarder.$promise.value = err;
          callBacks.forwarder.reject(err)
          }
        }
      })
  }
  this.handlerGroups = [];
};

$Promise.prototype.catch = function(errorCb) {
  return this.then(null, errorCb);
}


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

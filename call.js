var uuid = require("uuid");

var calls = [];

function Call() {
  this.peers = {};
}

Call.prototype.toJSON = function () {
  return { peers: this.peers };
};

Call.prototype.addPeer = function (peerId, room) {
  if (this.peers[room] === undefined) {
    this.peers[room] = [];
    this.peers[room].push(peerId);
  } else {
    this.peers[room].push(peerId);
  }
};

Call.prototype.removePeer = function (peerId, room) {
  var index = this.peers[room].lastIndexOf(peerId);
  if (index !== -1) this.peers[room].splice(index, 1);
};

Call.create = function () {
  var call = new Call();
  calls.push(call);
  return call;
};

Call.getAll = function () {
  return calls;
};

module.exports = Call;

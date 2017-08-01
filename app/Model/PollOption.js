'use strict'

const Lucid = use('Lucid');

class PollOption extends Lucid {

  static get createTimestamp () {
    return null;
  }

  static get updateTimestamp () {
    return null;
  }

  poll() {
    return this.belongsTo('App/Model/Poll');
  }

  votes() {
    return this.hasMany('App/Model/PollVote');
  }
}

module.exports = PollOption;

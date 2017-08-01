'use strict'

const Lucid = use('Lucid')

class PollVote extends Lucid {
static get createTimestamp () {
    return null;
  }

  static get updateTimestamp () {
    return null;
  }

  poll_option() {
    return this.belongsTo('App/Model/PollOption');
  }
}

module.exports = PollVote

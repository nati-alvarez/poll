'use strict'

const Lucid = use('Lucid');

class Poll extends Lucid {

  static get createTimestamp () {
    return 'created_at';
  }

  static get updateTimestamp () {
    return 'updated_at';
  }

  options() {
    return this.hasMany('App/Model/PollOption');
  }
}

module.exports = Poll;

'use strict'

const Poll = use('App/Model/Poll');
const PollOption = use('App/Model/PollOption');
const PollVote = use('App/Model/PollVote');
const Hash = use('Hash');

class PollController {

  * index(request, response) {
    var page = request.input('page', 1);
    var polls = yield Poll.query().orderBy('created_at').paginate(page, 6);
    console.log(polls.toJSON());
    yield response.sendView('allpolls', {polls: polls.toJSON()});
  }

  * create(request, response) {
    yield response.sendView('newpoll');
  }

  * store(request, response) {
    var name = request.input('title');
    var password = request.input('password');
    var hash = yield Hash.make(password);
    var options = request.input('option');

    var poll = new Poll({
      id: request.uniqueId(),
      poll_name: name,
      poll_password: hash,
      votes: 0,
      views: 0,
    });

    yield poll.save();

    var poll_options_arr = [];

    for (var i = 0; i < options.length; i++){
        var poll_option = {
          id: request.uniqueId(),
          poll_id: poll.id,
          poll_option: options[i]
        };
        poll_options_arr.push(poll_option);
    };

    yield PollOption.createMany(poll_options_arr);
    response.redirect('/polls', 302);
  }

  * vote(request, response) {
    //check if voter has already voted
    //if not, cast vote
    var polls = yield PollVote.query().where({'voter': request.ip(), 'poll_id': request.input('poll_id')});
    
    if (polls[0]){[]
      response.send('You have already voted for this poll');
    }else {
      //create new vote
      var vote = yield PollVote.create({
        id: request.uniqueId(),
        poll_id: request.input('poll_id'),
        option_id: request.input('answer_id'),
        voter: request.ip()
      });

      //update number of votes
      var updatePollVotes = yield Poll.findBy('id', request.input('poll_id'))
      updatePollVotes.fill({votes: updatePollVotes.votes + 1});
      yield updatePollVotes.save();
      response.send("Your vote has been cast");
    }
  }

  * show(request, response) {
    var url = request.hostname() + request.originalUrl();

    //update number of views
    var updatePollViews = yield Poll.findBy('id', request.param('id'))
    updatePollViews.fill({views: updatePollViews.views + 1});
    yield updatePollViews.save();

    //send poll data to view
    yield request.session.put('ip', request.ip());
    const ip = yield request.session.get('ip');
    var poll = yield Poll.find(request.param('id'));
    var options = yield PollOption.query().where({'poll_id': request.param('id')});
    var votes = yield PollVote.query().where({'poll_id': request.param('id')});
    yield response.sendView('poll', {poll: poll.toJSON(), options: options, votes: votes, ip: ip, url: url});
  }

  * edit(request, response) {
    //
  }

  * update(request, response) {
    
  }

  * destroy(request, response) {
    //
  }
}

module.exports = PollController

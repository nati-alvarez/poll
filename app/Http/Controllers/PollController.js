'use strict'

const Poll = use('App/Model/Poll');
const PollOption = use('App/Model/PollOption');
const PollVote = use('App/Model/PollVote');

const Hash = use('Hash');
const Validator = use('Validator');
const Database = use('Database');

class PollController {
  * index(request, response) {
    if(request.input('query') || request.input("sort")){
      var sort = '';
      var order = '';

      switch( request.input('sort') ){
        case 'asc':
          sort = 'created_at';
          order = 'asc';
          break;
        case 'desc':
          sort = 'created_at';
          order = 'desc';
          break;s
        case 'views':
          sort = 'views';
          order = 'desc';
          break;
        case 'votes':
          sort = 'votes';
          order = 'desc';
          break;
      }

      var pageNumber = request.input('page', 1);
      var query = request.input('query');
      var polls = yield Database.select('*').from('polls').where('poll_name', 'LIKE', '%'+query+'%').orderBy(sort, order).paginate(pageNumber, 5)
      yield response.sendView('allpolls', {polls, query, sort: request.input('sort')});
    } else{
      var pageNumber = request.input('page', 1);
      var polls = yield Poll.query().orderBy('created_at', 'desc').paginate(pageNumber, 5);
      polls = polls.toJSON();
      yield response.sendView('allpolls', {polls: polls});
    }
  }

  * create(request, response) {
    yield response.sendView('newpoll');
  }

  * store(request, response) {
    var name = request.input('title');
    var password = request.input('password');
    var hash = yield Hash.make(password);
    var options = request.input('option');
    var expires = request.input('expires') || null;

    
    var poll = new Poll({
      id: request.uniqueId(),
      poll_name: name,
      poll_password: hash,
      votes: 0,
      views: 0,
      expires: expires
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

  * login (request, response){
    if(request.input('admin')){
      var password = request.input('admin');
      var poll = yield Poll.findBy('id', request.param('id'));
      var correctPassword = yield Hash.verify(password, poll.poll_password);
      
      if (correctPassword){
        yield request.session.put('adminOf', request.param('id'));
        response.redirect('/polls/' + request.param('id') + '/edit');
      }else {
        response.redirect('/polls/' + request.param('id') + '?error=1');
      }

    }
  }

  * show(request, response) {
      const url = request.hostname() + request.originalUrl();

      if (request.cookie('pollBeingViewed') == request.param('id')){
        //don't update view count
      }else{
        //update view count and set cookie
        var updatePollViews = yield Poll.findBy('id', request.param('id'))
        updatePollViews.fill({views: updatePollViews.views + 1});
        yield updatePollViews.save();
        response.cookie('pollBeingViewed', request.param('id'), {
          httpOnly: true
        });
      }

      //send poll data to view
      yield request.session.put('ip', request.ip());
      const ip = yield request.session.get('ip');
      var poll = yield Poll.find(request.param('id'));
      var options = yield PollOption.query().where({'poll_id': request.param('id')});
      var votes = yield PollVote.query().where({'poll_id': request.param('id')});

      const today = new Date(Date.now());
      var expires = new Date(poll.expires);
      var votingPeriod = true; //true means you can still vote; voting period is ongoing

      if (poll.expires === null){
        votingPeriod = true;
      }
      else if(expires < today){
        votingPeriod = false;
      }else {
        votingPeriod = true;
      }

      var error;
      if(request.input('error') == 1){
        error = "Incorrect Password";
      }
      yield response.sendView('poll', {votingPeriod, poll: poll.toJSON(), error, options: options, votes: votes, ip: ip, url: url});
  }

  * edit(request, response) {
    var isAdmin = yield request.session.get('adminOf');
    if (isAdmin && isAdmin === request.param('id')){
      var poll = yield Poll.find(request.param('id'));
      var options = yield PollOption.query().where({'poll_id': request.param('id')});
      var votes = yield PollVote.query().where({'poll_id': request.param('id')});
      yield response.sendView('editpoll', {poll: poll, options: options, votes: votes});
    } else {
      response.redirect('/polls/' + request.param('id'));
    }
  } 

  * update(request, response) {
    var poll = yield Poll.findBy('id', request.param('id'));
    var options = yield PollOption.query().where({'poll_id': request.param('id')});
    
    var name = request.input('title') || poll.poll_name;
    var password = request.input('password');
    var expires = request.input('expires') || poll.expires;

    if (password){
      var hash = yield Hash.make(password);
    }else {
      var hash = poll.poll_password;
    }

    poll.poll_name = name;
    poll.poll_password = hash;
    poll.expires = expires;

    yield poll.save();

    var newOptions = request.input('option');

    if (newOptions.length > options.length){
      for (var i = options.length; i < newOptions.length; i++){
        var newOption = yield PollOption.create({
          id: request.uniqueId(),
          poll_id: poll.id,
          poll_option: newOptions[i]
        });
      }
    }

    response.redirect("/polls/" + poll.id);

  }

  * destroy(request, response) {
    var id = request.param('id');
    var poll = yield Poll.findBy('id', id);

    yield poll.delete();
    var pollOptions = yield Database
    .table('poll_options')
    .where('poll_id', id)
    .delete();
    var pollVotes = yield Database
    .table('poll_votes')
    .where('poll_id', id)
    .delete();

    response.send("<h4>Your poll has been deleted. Redirecting...</h4><script>setTimeout(function(){window.location.replace('/polls')}, 3000);</script>");
  }
}

module.exports = PollController

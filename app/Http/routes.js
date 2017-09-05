'use strict'

const Route = use('Route');
const Poll = use('App/Model/Poll');

Route.on('/').render('home');

Route.resource('polls', 'PollController').addMember('update', ['POST']).addMember('vote', ['POST']).addMember('login', ['POST']).middleware('uniqueId');

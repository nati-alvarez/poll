'use strict'

const uuid = use("uuid/v4");

class UniqueId {

  * handle (request, response, next) {
    request.uniqueId = uuid;
    yield next;
  }

}

module.exports = UniqueId

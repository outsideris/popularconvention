# parsing source
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

winston = require 'winston'

module.exports =
  extractType: (target) ->
    Object.prototype.toString.call(target).replace('[object ', '').replace(']', '').toLowerCase()

  logger: new (winston.Logger) (
    transports: [
      new (winston.transports.Console)(
        colorize: true
        timestamp: true
        prettyPrint: true
      )
    ]
  )


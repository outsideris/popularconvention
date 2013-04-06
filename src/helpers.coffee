# parsing source
#
# Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
# Licensed under the MIT license.
# <http://outsider.mit-license.org/>

module.exports =
  extractType: (target) ->
    Object.prototype.toString.call(target).replace('[object ', '').replace(']', '').toLowerCase()
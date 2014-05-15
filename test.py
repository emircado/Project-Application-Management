#!/usr/bin/python
import sys
import time
from socket import socket

CARBON_SERVER = '10.11.2.29'
CARBON_PORT = 2003
delay = 2 
sock = socket()

# data = {
#   '2014-04-01': [],
#   '2014-04-02': [],
#   '2014-04-03': [],
#   '2014-04-04': [],
#   '2014-04-05': []
# }

# data = {
#   '2014-05-15 08:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.succeeded 1.00'],

#   '2014-05-15 08:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.failed 1.00'],

#   '2014-05-15 09:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.succeeded 1.00'],

#   '2014-05-15 09:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.failed 1.00'],

#   '2014-05-15 10:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.succeeded 1.00'],

#   '2014-05-15 10:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.failed 1.00'],

#   '2014-05-15 11:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.succeeded 1.00'],

#   '2014-05-15 11:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.failed 1.00'],

#   '2014-05-15 12:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.succeeded 1.00'],

#   '2014-05-15 12:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.failed 1.00'],

#   '2014-05-15 13:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.succeeded 1.00'],

#   '2014-05-15 13:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.failed 1.00'],

#   '2014-05-15 14:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.succeeded 1.00'],

#   '2014-05-15 14:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.failed 1.00'],

#   '2014-05-15 15:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.succeeded 1.00'],

#   '2014-05-15 15:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.failed 1.00'],

#   '2014-05-15 16:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.succeeded 1.00'],

#   '2014-05-15 16:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.failed 1.00'],

#   '2014-05-15 17:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.succeeded 1.00'],

#   '2014-05-15 17:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
#                           'pamgmt.accounts.authentication.login.failed 1.0']
# }

data = {
  '2014-05-15 15:05:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
                          'pamgmt.accounts.authentication.login.attempted 1.00'],

  # '2014-04-01 08:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.failed 1.00'],

  # '2014-04-01 09:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.succeeded 1.00'],

  # '2014-04-01 09:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.failed 1.00'],

  # '2014-04-01 10:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.succeeded 1.00'],

  # '2014-04-01 10:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.failed 1.00'],

  # '2014-04-01 11:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.succeeded 1.00'],

  # '2014-04-01 11:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.failed 1.00'],

  # '2014-04-01 12:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.succeeded 1.00'],

  # '2014-04-01 12:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.failed 1.00'],

  # '2014-04-01 13:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.succeeded 1.00'],

  # '2014-04-01 13:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.failed 1.00'],

  # '2014-04-01 14:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.succeeded 1.00'],

  # '2014-04-01 14:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.failed 1.00'],

  # '2014-04-01 15:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.succeeded 1.00'],

  # '2014-04-01 15:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.failed 1.00'],

  # '2014-04-01 16:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.succeeded 1.00'],

  # '2014-04-01 16:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.failed 1.00'],

  # '2014-04-01 17:00:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.succeeded 1.00'],

  # '2014-04-01 17:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
  #                         'pamgmt.accounts.authentication.login.failed 1.0']
}

try:
  sock.connect( (CARBON_SERVER,CARBON_PORT) )
except:
  print "Couldn't connect to %(server)s on port %(port)d, is carbon-agent.py running?" % { 'server':CARBON_SERVER, 'port':CARBON_PORT }
  sys.exit(1)




for key in data:
  t = int(time.mktime(time.strptime(key, '%Y-%m-%d %H:%M:%S')))

  lines = []
  for line in data[key]:
    lines.append(line+' '+str(t))
  
  message = '\n'.join(lines) + '\n' #all lines must end in a newline
  print "sending message\n"
  print key
  print '-' * 80
  print message
  sock.sendall(message)
  time.sleep(delay)

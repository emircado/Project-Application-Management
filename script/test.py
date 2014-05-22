#!/usr/bin/python
import sys
import time
from socket import socket

CARBON_SERVER = '10.11.2.29'
CARBON_PORT = 2003
delay = 9 
sock = socket()

data = {
  '2014-05-': {
    '08:00:00': ['pamgmt.accounts.authentication.login.attempted 0.00',
                'pamgmt.accounts.authentication.login.failed 0.00',
                'pamgmt.accounts.authentication.login.succeeded 0.00'],

    '08:30:00': ['pamgmt.accounts.authentication.login.attempted 1.00',
                'pamgmt.accounts.authentication.login.failed 1.00'],

    '09:00:00': ['pamgmt.accounts.authentication.login.attempted 2.00',
                'pamgmt.accounts.authentication.login.succeeded 1.00'],

    '09:30:00': ['pamgmt.accounts.authentication.login.attempted 4.00',
                'pamgmt.accounts.authentication.login.failed 3.00'],

    '11:00:00': ['pamgmt.accounts.authentication.login.attempted 5.00',
                'pamgmt.accounts.authentication.login.succeeded 2.00'],

    '11:30:00': ['pamgmt.accounts.authentication.login.attempted 6.00',
                'pamgmt.accounts.authentication.login.failed 4.00'],

    '12:00:00': ['pamgmt.accounts.authentication.login.attempted 7.00',
                'pamgmt.accounts.authentication.login.succeeded 3.00'],

    '12:30:00': ['pamgmt.accounts.authentication.login.attempted 9.00',
                'pamgmt.accounts.authentication.login.failed 6.00'],

    '12:00:00': ['pamgmt.accounts.authentication.login.attempted 11.00',
                'pamgmt.accounts.authentication.login.succeeded 5.00'],

    '12:30:00': ['pamgmt.accounts.authentication.login.attempted 12.00',
                'pamgmt.accounts.authentication.login.failed 7.00'],

    '13:00:00': ['pamgmt.accounts.authentication.login.attempted 14.00',
                'pamgmt.accounts.authentication.login.succeeded 7.00'],

    '13:30:00': ['pamgmt.accounts.authentication.login.attempted 15.00',
                'pamgmt.accounts.authentication.login.failed 8.00'],

    '14:00:00': ['pamgmt.accounts.authentication.login.attempted 18.00',
                'pamgmt.accounts.authentication.login.succeeded 10.00'],

    '14:30:00': ['pamgmt.accounts.authentication.login.attempted 19.00',
                'pamgmt.accounts.authentication.login.failed 9.00'],

    '15:00:00': ['pamgmt.accounts.authentication.login.attempted 21.00',
                'pamgmt.accounts.authentication.login.succeeded 12.00'],

    '15:30:00': ['pamgmt.accounts.authentication.login.attempted 22.00',
                'pamgmt.accounts.authentication.login.failed 10.00'],

    '16:00:00': ['pamgmt.accounts.authentication.login.attempted 26.00',
                'pamgmt.accounts.authentication.login.succeeded 16.00'],

    '16:30:00': ['pamgmt.accounts.authentication.login.attempted 28.00',
                'pamgmt.accounts.authentication.login.failed 12.00'],

    '17:00:00': ['pamgmt.accounts.authentication.login.attempted 29.00',
                'pamgmt.accounts.authentication.login.succeeded 17.00'],

    '17:30:00': ['pamgmt.accounts.authentication.login.attempted 30.00',
                'pamgmt.accounts.authentication.login.failed 13.0']}
}

try:
  sock.connect( (CARBON_SERVER,CARBON_PORT) )
except:
  print "Couldn't connect to %(server)s on port %(port)d, is carbon-agent.py running?" % { 'server':CARBON_SERVER, 'port':CARBON_PORT }
  sys.exit(1)

for day in range(1,22):
  for data_month in data:
    data_date = data_month+str(day)
    print data_date
    for data_time in data[data_month]:
      t = int(time.mktime(time.strptime(data_date+' '+data_time, '%Y-%m-%d %H:%M:%S')))

      lines = []
      for line in data[data_month][data_time]:
        lines.append(line+' '+str(t))

      message = '\n'.join(lines) + '\n' #all lines must end in a newline
      print "sending message\n"
      # print key
      print '-' * 80
      print message
      sock.sendall(message)
      time.sleep(delay)

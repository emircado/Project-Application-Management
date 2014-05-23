#!/usr/bin/python
import sys
import time
import random
from socket import socket
from datetime import date

CARBON_SERVER = '10.11.2.29'
CARBON_PORT = 2003
delay = 11
sock = socket()

# Change months and days range to desired range
months = ('2014-05', )
days = {
    '2014-04': range(20, 31),
    '2014-05': range(12, 22)
}

hours = range(0,24)
minutes = range(0,60)
seconds = range(0,60)
delta = range(1,4)  #increase per hit

metrics = ( 'pamgmt.accounts.authentication.login.attempted',
            'pamgmt.accounts.authentication.login.succeeded',
            'pamgmt.accounts.authentication.login.failed')
either = (metrics[1], metrics[2])

try:
    sock.connect( (CARBON_SERVER,CARBON_PORT) )
except:
    print "Couldn't connect to %(server)s on port %(port)d, is carbon-agent.py running?" % { 'server':CARBON_SERVER, 'port':CARBON_PORT }
    sys.exit(1)

def reset():
    timestamp = int(time.mktime(time.strptime(month+'-'+day_str+' 00:00:00', '%Y-%m-%d %H:%M:%S')))

    lines = []
    # set stats to zero
    for metric in metrics:
        lines.append(metric+' 0.00 '+str(timestamp))

    message = '\n'.join(lines) + '\n' #all lines must end in a newline
    print "sending message\n"
    print '-' * 80
    print message
    sock.sendall(message)
    time.sleep(delay)
  
for month in months:
    print 'currently on '+month
  
    for day in days[month]:
        day_str = str(day)
        day_str = '0'+day_str if len(day_str) == 1 else day_str
        print 'on '+day_str

        reset()

        # produce logins
        points = random.randint(30, 100)
        timestamps = []
        for point in range(points):
            h = str(random.choice(hours))
            m = str(random.choice(minutes))
            s = str(random.choice(seconds))
            h = '0'+h if len(h) == 1 else h
            m = '0'+m if len(m) == 1 else m
            s = '0'+s if len(s) == 1 else s

            timestamps.append(month+'-'+day_str+' '+h+':'+m+':'+s)
    
        total_attempts = 0
        total_succeeded = 0
        total_failed = 0

        for timestamp in sorted(timestamps):
            t = int(time.mktime(time.strptime(timestamp, '%Y-%m-%d %H:%M:%S')))
            hits = random.choice(delta)
            total_attempts = total_attempts + hits

            login_result = random.choice(either)
            login_hits = 0

            if login_result.endswith('succeeded'):
                total_succeeded = total_succeeded + hits
                login_hits = total_succeeded
            elif login_result.endswith('failed'):
                total_failed = total_failed + hits
                login_hits = total_failed

            lines = []
            lines.append(metrics[0]+' '+str(total_attempts)+'.00'+' '+str(t))
            lines.append(login_result+' '+str(login_hits)+'.00'+' '+str(t))

            message = '\n'.join(lines) + '\n' #all lines must end in a newline
            print "sending message\n"
            print '-' * 80
            print message
            sock.sendall(message)
            time.sleep(delay)
import socket
import time
import sys

CARBON_SERVER = '10.11.2.29'
CARBON_PORT_UDP = 2023
CARBON_PORT_TCP = 2003
sock = socket.socket()

t = int(time.time())
# try:
#     sock.connect( (CARBON_SERVER,CARBON_PORT_TCP) )
# except:
#     print "Couldn't connect to %(server)s on port %(port)d, is carbon-agent.py running?" % { 'server':CARBON_SERVER, 'port':CARBON_PORT_TCP }
#     sys.exit(1)

# message = "system.luke 2.00\n"
# print message
# sock.sendall(message)
# sock.close()

# time.sleep(11)

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
message = "system.lukeup 3.00 "+str(t)+"\n"
sock.sendto(message, (CARBON_SERVER, CARBON_PORT_UDP))
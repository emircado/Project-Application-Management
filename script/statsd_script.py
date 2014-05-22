#!/usr/bin/python
import time
from statsd_client import StatsdClient

STATSD_ADDR = ('10.11.2.29', 8125)

# Reset here
# StatsdClient.send({"pamgmt.accounts.authentication.login.attempted":"0|g"}, STATSD_ADDR)
# StatsdClient.send({"pamgmt.accounts.authentication.login.succeeded":"0|g"}, STATSD_ADDR)
# StatsdClient.send({"pamgmt.accounts.authentication.login.failed":"0|g"}, STATSD_ADDR)
# StatsdClient.send({"system.newluke":"0|g"}, STATSD_ADDR)

while True:
    print "sending..."
    StatsdClient.send({"system.lukeup":"+1|g"}, STATSD_ADDR)

    # StatsdClient.send({"pamgmt.accounts.authentication.login.succeeded":"+1|g"}, STATSD_ADDR)
    time.sleep(11)
#!/usr/bin/python

# INSTRUCTIONS
# to run in terminal: python db_import_csv.py <filename>
# 





import sys
import os
import MySQLdb

# taken from
# http://stackoverflow.com/questions/372885/how-do-i-connect-to-a-mysql-database-in-python
# http://chriseiffel.com/everything-linux/how-to-import-a-large-csv-file-to-mysql/
# http://dev.mysql.com/doc/refman/5.0/en/load-data.html

if len(sys.argv) == 1:
    print 'Format: python db_import_csv.py <filename>'
else:
    filename = sys.argv[1] # the csv file
    
    # connect to the database
    db = MySQLdb.connect(host="10.11.7.10", user="projects", passwd="projects", db="projects")
    cur = db.cursor()

    cur.execute("DELETE FROM test")

    # create a temporary table 
    # cur.execute("DROP TABLE IF EXISTS temp_table")
    # cur.execute("CREATE TABLE temp_table LIKE test")

    # import csv into temporary table
    os.system("mysqlimport --ignore-lines=1 --fields-terminated-by=, --fields-optionally-enclosed-by='\"' --columns='name,server_type,hostname,public_ip,private_ip,network,location,description,production_date,termination_date,date_created,date_updated,created_by,updated_by' --local -h10.11.7.10 -uprojects -pprojects projects "+filename)

    # update existing rows
    # cur.execute("UPDATE test INNER JOIN temp_table ON temp_table.test1 = test.test1 SET test.test2 = temp_table.test2")
    # create new rows
    # cur.execute("INSERT INTO test (test1,test2) SELECT t.test1, t.test2 FROM temp_table t WHERE t.test1 NOT IN (SELECT test1 FROM test)")

    # delete temporary table
    # cur.execute("DROP TABLE temp_table")
    db.close()
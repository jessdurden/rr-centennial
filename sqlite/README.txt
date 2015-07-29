**********************************************************************************************************
Basic opening instrucitons for the Centennial Database and some basic Command Prompt work.  
Documentation about SQLite:  https://www.sqlite.org/docs.html

Note: When I am giving step-by-step instructions, I delimit the instructions with an arrow ('->')


Created by: Kyle Mitchell (Kyle.Mitchell@rolls-royce.com)
Last Modified on: (7/19/2015)
**********************************************************************************************************


____________________________________________________________________________________________________________________________________________________________________________
To open the database:

	Open an instance of Command Prompt (Windows Key -> type 'cmd' -> hit enter)
	Naviagte to the location of SQLite folder and go in (since it is on my desktop, I'd type: 'cd Desktop' -> hit enter -> 'cd SQLite' -> hit enter)
	Type: 'sqlite3' -> hit enter
	(Note: Your command line will change as you enter the sqlite3 executable [no worries!])
	Open the database (type '.open db.sqlite' -> hit enter)
	You did it!
____________________________________________________________________________________________________________________________________________________________________________
Look around the database:

	To view the tables within the database: (Type '.tables' -> hit enter)
	To view contents of a table: (Type: 'SELECT * FROM table_name;' where table_name is the name of the table you want to view)
	(Note: your command will NOT be sent until you end it with a semicolon! Don't forget it!)
	To view table structure: (Type: 'pragma table_info(table_name);' where table_name is the name of the table you want to view)
____________________________________________________________________________________________________________________________________________________________________________
To close executable and return to command prompt:

	Hit CTRL+C
____________________________________________________________________________________________________________________________________________________________________________

For now there is only one item in each table within the database.  Please note that any changes you make to the database are LOCAL!  There is no global databse that
keeps track of changes, insertions, etc.  Thus don't worry too much about messing things up, I, (Kyle M.), will retain a copy that I can always redistribute.

Have fun!
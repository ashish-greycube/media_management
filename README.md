## Media Management

Customization for Nulight Media Company

[1]fonts to be installed

sudo apt-get install -y fonts-liberation

[2]Python barcode library to be installed

[2.1]activate env

frappe-bench$ source env/bin/activate

[2.2]

$ pip install python-barcode (in env)

$ pip install pillow (in env)

[3] on UI, one time steps for all users to reflect correct list view columns: needs to be done if we have new server
[3.1] Go to

https://nls13.greycube.in/app/media

https://nls13.greycube.in/app/media-transfer

[3.2]Menu-->List Settings-->Maximum Number of Fields 6 : save
#### License

MIT

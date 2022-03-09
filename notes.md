So for these next couple 'days' were gonna be using NoSQL particularly Mongo with nodeJS to create a functioning site.

The database structure will have two main documents, one for Posts containing relevant info about them including preview, body etc, and will also link to the second document, that of the authors, which again will be linked via the name and ID of each author.

![alt text](database-layout.jpg "Title");

Soemthing to note again, remember this

![alt text](database-authors-connection.jpg "Title");

Also to remember, here in the options for authors in the create-post.ejs file, we have author id in the option values, because while the database only has 3 authors, it is technically possible for mulriple authors to have the same name, but not the same ID, so we use that isntaead.

![alt text](database-value.jpg "Title");

Here in the dev tools we can see the values are the author ids

![alt text](data-options.jpg "Title");

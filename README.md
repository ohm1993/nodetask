Created two api one is "/populate" which will first read the data from a json file and store it to the database called jsonposts
and after that it will check for a csv file and read that file as a stream and write it to a csv file and after that through csv parser module
it will read the csv data and collect the records into an array push those records to the csvposts data.
Second end point will search the records into an csvposts table by name email and body

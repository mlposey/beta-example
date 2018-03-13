# provider
This Node.js app responds to path queries for a given map. It takes a
JSON body of the form
```
{
    "src": {
        "x": integer,
        "y": integer
    },
    "dst": {
        "x": integer,
        "y": integer
    }
}
```
at the endpoint `POST /v1/paths`. A 200 reponse code indicates that
a path was found and will be accompanied by a body of the form
```
{
    "path": [{"x": integer, "y": integer}...]
}
```
A 404 response indicates that a path could not be found. It is accompanied
by the body
```
{
    "message": string
}
```
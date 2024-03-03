var bList = []
var currentBook = ""

function numDig(code)
{
    var copy  = parseInt(code);
    var count = 0;
    while(copy>0)
    {
        count += 1
        copy = Math.floor(copy/10)
    }
    return count
}

function randomItem(arr)
{
    if(arr.length==1)
        return arr[0]
    else 
        return arr[Math.floor(arr.length*Math.random())]
}

async function findBook(type)
{
    var list = document.getElementById("bookList")
    var src  = document.getElementById("bookSearch")
    var src1 = document.getElementById("titleSearch")
    var src2 = document.getElementById("authorSearch")

    let query = ""
    let url = ""

    // Building the search URL from 'query'    
    if(type=='title') // Search by Title
    {
        query = src1.value.split(' ').join('+')   
        url = "https://openlibrary.org/search.json?title="+query
    }
    else if(type=='author') // Search by Author
    {
        query = src2.value.split(' ').join('+')
        url = "https://openlibrary.org/search.json?author="+query
    }
    else // Search Everything
    {    
        query = src.value.split(' ').join('+')
        url = "https://openlibrary.org/search.json?q="+query
    }

    console.log(url)

    let found = false

    try{

        let res  = await fetch(url)
        let data = await res.json()
        console.log(data)

        list.innerHTML = ""
        for(book of data.docs)
        {
            if(book.oclc!=undefined)
            {
                found = true

                const opt = document.createElement("option")
                opt.value = randomItem(book.oclc)
                
                if(book.author_name!=undefined)
                    opt.innerText = book.title+" ("+book.author_name.join(';')+")"
                else
                    opt.innerText = book.title

                list.appendChild(opt);
            }
        }
    }catch(err){
        console.log(err)
    }

    if(!found)
        alert("Sorry, No Public Books Found!")
}

const queryString = window.location.search;
const params = queryString.split('&');

var args = {}
for (var param of params) 
{
    let item = param.split('=');
    args[item[0]] = item[1]
}

if(Object.keys(args).length>1) // Set the onload Callback Function.
{   
    console.log(args["bookList"])
    google.books.load();
    google.books.setOnLoadCallback(()=>{
        var viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
        viewer.load(`OCLC:${args["bookList"]}`);
    }); 
}

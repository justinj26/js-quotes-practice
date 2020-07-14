// append nothing directly to the body (go back and relearn DOMContentLoaded)

// top level functions for querySelector and createElement

function qs(selector) {
    return document.querySelector(selector)
}

function ce(element) {
    return document.createElement(element)
}

// top level forms and bins
const quoteList = qs("ul#quote-list")
const quoteForm = qs('form#new-quote-form')

function fetchQuotes() {
    fetch(`http://localhost:3000/quotes?_embed=likes`)
    .then(res => res.json())
    .then(quotes => showQuotes(quotes))
    
}

function showQuotes(quotes) {
    quotes.forEach(quote => addQuote(quote))
}

function addQuote(quote) {
    let quoteCard = ce('li')
    quoteCard.className = 'quote-card'

    let blockQuote = ce('blockquote')
    blockQuote = ce('blockquote')

    let quoteContent = ce('p')
    quoteContent.className = 'mb-0'
    quoteContent.innerText = quote.quote

    let author = ce('footer')
    author.className = 'blockquote-footer'
    author.innerText = quote.author 

    ce('br')

    let likeBtn = ce('button')
    likeBtn.className = 'btn-success'
    likeBtn.innerHTML = `Likes: <span>${quote.likes.length}<span>`

    likeBtn.addEventListener('click', async () => {
      let like = await addLikes(quote, likeBtn)
      likeBtn.innerHTML = `Likes: <span>${quote.likes.push(like) }<span>`
        
    })
likeBtn.innerHTML = `Likes: <span>${quote.likes.length}<span>`
    // great time for a like button event listener

    // delete button
    let deleteBtn = ce('button')
    deleteBtn.classname = 'btn-danger'
    deleteBtn.innerText = 'Delete'

    blockQuote.append(quoteContent, author, likeBtn, deleteBtn)
    quoteCard.append(blockQuote)

    deleteBtn.addEventListener('click', ()=> {
        
        fetch(`http://localhost:3000/quotes/${quote.id}`, { method: 'DELETE' })
        quoteCard.remove()
    })

   
    quoteList.append(quoteCard)
}

fetchQuotes()

// There's a delete button for every quote, 
// and immediately after hitting the delete button,
// I want to send a delete request to appropriate address immediately,
// which includes an event listener on the delete button
async function addLikes(quote, likeBtn) {
    
    let response = await fetch(`http://localhost:3000/likes`, { method: "POST",
                                                             headers: {
                                                                'content-type':'application/json'
                                                            },
                                                            body: JSON.stringify({
                                                                quoteId: quote.id,
                                                                createdAt: Date.now()
                                                            })
                                                        })
    let updatedQuote = await response.json()
    return updatedQuote 
}





// Submitting new quote

// Post request

quoteForm.addEventListener('submit', () => {
    event.preventDefault()
    debugger
    let newQuote = event.target[0].value
    let newAuthor = event.target[1].value 

    let configObj = {
        method: "POST",
        headers: {
            'content-type':'application/json'
        },
        body: JSON.stringify({
            quote: newQuote,
            author: newAuthor
        })
    }
    fetch(`http://localhost:3000/quotes`, configObj)
    .then(res => res.json())
    .then(quoteToAdd => {
        addQuote(quoteToAdd)
        quoteForm.reset()
       
        debugger
    })

    
})


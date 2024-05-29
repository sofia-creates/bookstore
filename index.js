let registerBtn = document.querySelector('#registerBtn');
let loginBtn = document.querySelector('#loginBtn');
let myPagesBtn = document.querySelector('#myPagesBtn');


let bookContainer = document.querySelector('#bookContainer');
let greeting = document.querySelector('#greeting');
let header = document.querySelector('header');
let sortingContainer = document.querySelector('#sortingContainer');
let body = document.querySelector('body');
let navLogo = document.querySelector('#navLogo');
let navLogoWhite = document.querySelector('#navLogoWhite');

let currentUser;

let getColors = async () => {

    console.log('getColors is run');
    let colorScheme = await axios.get('http://localhost:1337/api/color-scheme');
    console.log(colorScheme);
    colorScheme = colorScheme.data.data.attributes.mode;
    body.classList.add(colorScheme);
    console.log(colorScheme);

    //change colors of logo in darkmode and funmode
    if(colorScheme =='darkmode' || colorScheme =='funmode'){
        
        navLogo.classList.add('hide');
        navLogoWhite.classList.remove('hide');
    }else if(colorScheme == 'lightmode'){
        console.log('if is run')
        navLogoWhite.classList.add('hide');
        navLogo.classList.remove('hide');
    }

    body.addEventListener('click', ()=>{
        if(colorScheme =='funmode'){
            let audioPlayer = document.querySelector('#audioPlayer');
            audioPlayer.autoplay = true; 
            audioPlayer.load();          
            audioPlayer.play();  


            let discoball = document.querySelector('#discoball');
            discoball.classList.remove('hide');
        } 

       
    })
}

getColors();


//color scheme selection
// let radioNodeList = document.querySelectorAll('input[type="radio"][name="colorSchemeRadio"]');

// radioNodeList.forEach((radio) =>{
//     radio.addEventListener()
// })

//print greeting
if (sessionStorage.getItem('user')){
    let user = sessionStorage.getItem('user');
    user = JSON.parse(user);
    if(greeting){
        greeting.innerText = `Welcome, ${user.username}!`
    }
}



let register = async() => {
    console.log('register is run');
    //post http anrop körs här
    let username = document.querySelector('#usernameInput').value;
    let password = document.querySelector('#passwordInput').value;

    try {
        let user = await axios.post(
            "http://localhost:1337/api/auth/local/register",
            {
                username: username,
                email: 'test@testing.com',
                password: password,
                confirmed: true
            }
        )
        console.log(user);
    } catch(error){
            console.error('error: ' + error)
    }

    
}

let login = async() => {
    console.log('login is run');
    //post http anrop körs här
    let username = document.querySelector('#usernameInput').value;
    let password = document.querySelector('#passwordInput').value;

    try {
        let user = await axios.post('http://localhost:1337/api/auth/local/', {
            identifier: username,
            password: password,
        })

        sessionStorage.setItem("token", user.data.jwt);
        sessionStorage.setItem("user", JSON.stringify(user.data.user));
        currentUser = user.data.user;
    
        console.log(user.data);
        console.log(`${user.data.user.username} is now logged in`);
        greeting.innerText = `Welcome, ${user.data.user.username}!`
    } catch(error) {
        console.error('error: ' + error )
    }

    myPagesBtn.classList.remove('hide');

}

let logout = async() => {
    console.log('logout is run');
    sessionStorage.clear();
    //rendera om sidan här sen
    myPagesBtn.classList.add('hide');
}

loginBtn.addEventListener('click', login);
registerBtn.addEventListener('click', register);
logoutBtn.addEventListener('click', logout);


//Show My pages Btn if logged in
if(sessionStorage.getItem("user")){
    myPagesBtn.classList.remove("hide");
}

// //TEST nedan
// let testWrapping = async () => {
//     let testingBook = await axios.get('http://localhost:1337/api/users/2/');
//     console.log(`test 1: ${testingBook}`)

// }
// testWrapping();

 //Adding books to TBR list, to be used within the renderBooks function
 
 //rendering books 
 let renderBooks = async (container, url) => {
    // let booksInStore = await axios.get('http://localhost:1337/api/books?populate=*');
    let booksInStore = await axios.get(url);
    if(url == 'http://localhost:1337/api/books?populate=*'){
        booksInStore = booksInStore.data.data;
    } else {
        booksInStore = booksInStore.data.books;
    }
    console.log(booksInStore);


    //SORTING
    //check if sorting is on
    if (selectSorting.value == 'author'){
        //sort by author
        booksInStore.sort((a,b) => {
            if (a.author < b.author) return -1;
            if (a.author > b.author) return 1;
            return 0;
        })

        console.log(booksInStore);

    } else if (selectSorting.value == 'title'){
        //sort by title
        booksInStore.sort((a,b) =>{
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return 0;
        })
    }






    //Start by clearing out the container
    container.innerHTML = '';
    
    booksInStore.forEach(book => {
        //console.log(book);
        let cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        let title = document.createElement('h3');
        let author = document.createElement('p');
        //create components
        let likeBtn = document.createElement('button');
        likeBtn.innerHTML= '<i class="fa-regular fa-heart"></i>';
        //if sats här som kollar om book ligger i user.books

        let price = document.createElement('p');
        let publishingDate = document.createElement('p');
        let pageNumber = document.createElement('p');

        let coverImg = document.createElement('img'); 
        coverImg.style.width = '100%';

        if(url == 'http://localhost:1337/api/books?populate=*'){ //this is main page
            title.innerText = book.attributes.title;
            author.innerText = book.attributes.author;
            price.innerText = `Price: ${book.attributes.price}`;
            publishingDate.innerText = `Published: ${book.attributes.publishingDate}`;
            pageNumber.innerText = `Pages: ${book.attributes.pagenumber}`;
            
            //console.log(book.attributes.cover.data.attributes.formats.thumbnail.url)
        
            coverImg.src = `http://localhost:1337${book.attributes.cover?.data.attributes.formats.thumbnail.url}`;
           




        } else { // this is for my pages with tbr list
            title.innerText = book.title;
            author.innerText = book.author;
            price.innerText = `Price: ${book.price}`;
            publishingDate.innerText = `Published: ${book.publishingDate}`;
            pageNumber.innerText = `Pages: ${book.pagenumber}`;
            coverImg.src = `http://localhost:1337${book.cover?.formats.thumbnail.url}`;
        }

        // console.log(book.attributes.cover.data.attributes.formats)
        
        // console.log(book.attributes.cover.data.attributes.formats.small)
        
        // console.log(book.attributes.cover.data.attributes.formats.thumbnail.url)
        // coverImg.src = book.attributes.cover?.data.attributes.formats.thumbnail.url;
        
        
        //<img src="http://localhost:1337${todo.img?.url}" height="100"/>
        
        let addBookToTBR = async() => {

            let user = sessionStorage.getItem('user');
            user = JSON.parse(user);
            let userId = user.id;

            let bookId = book.id;
            console.log(book);
            console.log(`userId is: ${userId} and bookId is: ${bookId}`);
            

            // Fetch current list of books
            let response = await axios.get(`http://localhost:1337/api/users/${userId}?populate=books`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                }
            });

            let currentBooks = response.data.books.map(b => b.id);

            //Add new book to the list, or remove it if it is already in the list
            if (!currentBooks.includes(bookId)) {
                currentBooks.push(bookId); //adds new book here
            } else {
                //removing bookId here
                let index = currentBooks.indexOf(bookId);

                if (index !== -1) {
                currentBooks.splice(index, 1);
            }
            }

            // Update the users books
            let updatedUser = await axios.put(`http://localhost:1337/api/users/${userId}`, 
                {
                    books: currentBooks.map(id => ({ id }))
                },   
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`
                    }
                }
            );
           
        } // här slutar addBookToTBR

        //hämta userid, lägg sen till i user /books via http

        likeBtn.addEventListener('click', ()=>{
            if(!likeBtn.classList.contains('liked')){
                //console.log('if satsen funkar')
                likeBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
                likeBtn.classList.add('liked');
            } else {
                likeBtn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
                likeBtn.classList.remove('liked');
            }
            // likeBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
            
            addBookToTBR();
        })
        
        cardDiv.append(coverImg);
        cardDiv.append(title);
        cardDiv.append(author);
        cardDiv.append(likeBtn);   
        cardDiv.append(price); 
        cardDiv.append(publishingDate);
        cardDiv.append(pageNumber);
        container.append(cardDiv);  
    });
}
renderBooks(bookContainer, 'http://localhost:1337/api/books?populate=*');

//going back from My pages
navLogo.addEventListener('click' , () =>{
    //console.log('logo clicked');
    renderBooks(bookContainer, 'http://localhost:1337/api/books?populate=*')})
navLogoWhite.addEventListener('click' , () =>{
     //console.log('logo clicked');
    renderBooks(bookContainer, 'http://localhost:1337/api/books?populate=*')
} )



// MY PAGES

//Components for sorting
let selectSorting = document.createElement('select');
let sortByAuthor = document.createElement('option');
let sortByTitle = document.createElement('option');

sortByAuthor.innerText = 'Sort by author';
sortByAuthor.value = 'author'
sortByTitle.innerText = 'Sort by Title';
sortByTitle.value = 'title';

selectSorting.appendChild(sortByAuthor);
selectSorting.appendChild(sortByTitle);
let sortingBtn = document.createElement('button');
sortingBtn.innerText = 'Sort';
sortingContainer.append(selectSorting);
sortingContainer.append(sortingBtn);

myPagesBtn.addEventListener('click', () => {
    //get the current user id
    let userForURL = sessionStorage.getItem('user');
    userForURL = JSON.parse(userForURL);
    //console.log(userForURL);
    let userIdForURL = userForURL.id;

    //Add new headlines
    greeting.innerText = 'Welcome to your pages!';
    let subheading = document.createElement('h2');
    subheading.innerText = 'Reading list';
    header.append(subheading);


    sortingContainer.classList.remove('hide');

    sortingBtn.addEventListener('click', () =>{
        console.log('sort btn clicked')
        renderBooks(bookContainer, `http://localhost:1337/api/users/${userIdForURL}?populate=deep,3` ) 
    } 
)

    renderBooks(bookContainer, `http://localhost:1337/api/users/${userIdForURL}?populate=deep,3` )
})





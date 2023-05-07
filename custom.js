let news = [];
let page = 1;
let totalPages = 0;
let topicButtons = document.querySelectorAll('.topic_list button');
let searchButton = document.getElementById('search_button');
let url;

const getNews = async () => {
  try{

    let header = new Headers({
      'x-api-key' : '99dMqk0KDre1YS1UJWrJLvAXp-JgyICR8ZWTjNm2jco'
    });


    url.searchParams.set('page', page);
    let response = await fetch (url, { headers : header });
    let data = await response.json();

    if(response.status == 200){
      if(data.total_hits == 0){
        throw new Error('No search results.')
      }
      news = data.articles;
      totalPages = data.total_pages;
      page = data.page;
      render()
      pagination()
    } else {
      throw new Error(data.message)
    }
  
  } catch(error){
    errorRender(error.message)
  }

}

topicButtons.forEach(topic=> topic.addEventListener('click', (event)=>getNewsByTopic(event)))

const getLateNews = async () => {
  url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=US&page_size=5`);

  getNews();
}

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();

  url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=US&page_size=5&topic=${topic}`);

  getNews();

}

const getNewsByKeyword = async () => {

  let keyword = document.getElementById('search_input').value;
  url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=5`)

  getNews();
};

const render = () => {
  let newsHTML = ``;

  newsHTML = news.map(item=>{
    return `<div class="row news_item">
    <div class="col-lg-4 thumb">
      <img src="${
        item.media ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
      }" />
    </div>
    <div class="col-lg-8">
      <h1>
        ${item.title}
      </h1>
      <p>${
        item.summary == null || item.summary == ''
          ? "내용없음"
          : item.summary.length > 200
          ? item.summary.substring(0, 200) + '...'
          : item.summary
        }
      </p>
      <span>
        ${item.rights || "no source"}  ${moment(
          item.published_date
        ).fromNow()}
      </span>
    </div>
  </div>`
  }).join('')

  document.getElementById('news_items').innerHTML = newsHTML;
}

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center fs-2" role="alert">${message}</div>`
  document.getElementById('news_items').innerHTML = errorHTML;
}

const pagination = () => {

  let paginationHTML = ``;
  let pageGroup = Math.ceil(page/5);
  let lastPage = pageGroup * 5;
  let firstPage = lastPage - 4 <= 0 ? 1 : lastPage - 4;

  if(lastPage > totalPages) {
    last = totalPages;
  }


  if(firstPage >= 6) {
    paginationHTML = `
    <li class="page-item" onclick="moveToPage(1)"><a class="page-link" href='#js-bottom'>&lt;&lt;</a></li>
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
          <span aria-hidden="true">&lt;</span>
        </a>
      </li>`
  }

  for(let i=firstPage; i<lastPage; i++){
    paginationHTML += `<li class="page-item ${page == i ? "active" : ""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
  }

  if (lastPage < totalPages) {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})">
                        <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                       </li>
                       <li class="page-item" onclick="moveToPage(${totalPages})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`;
  }



  document.querySelector('.pagination').innerHTML = paginationHTML;
}

const moveToPage = (pageNum) => {
  page = pageNum;
  getNews()
}

searchButton.addEventListener('click', getNewsByKeyword);
getLateNews();



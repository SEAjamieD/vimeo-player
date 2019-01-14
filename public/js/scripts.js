//
//  UTILITY FUNCTIONS
//
const utility = {
	// david walsh debounce - https://davidwalsh.name/javascript-debounce-function
	debounce: (func, wait, immediate) => {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	},

	// set cookies
	setCookie: (name, value) => {
		let today = new Date();
		let twoWeeks = new Date(Date.now() + 12096e5);
		twoWeeks = twoWeeks.toUTCString();
		document.cookie = `${name}=${value}; expires=${twoWeeks};`
	},

	//Check for existing time set cookie and set the player to that time
	getCookieSeconds: () => {
	  let seconds = 0;
	  if ( document.cookie.split(';').filter((item) => item.includes('jVimSeconds=')).length ) {
	    seconds = document.cookie.replace(/(?:(?:^|.*;\s*)jVimSeconds\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	    seconds = seconds >= 0 ? seconds : 0;
	  }
	  return seconds;
	},

	//Check for existing video id set cookie and set the player to that video
	getCookieVideo: () => {
	  let video = 59777392;
	  if ( document.cookie.split(';').filter((item) => item.includes('jVimVideo=')).length ) {
	    video = document.cookie.replace(/(?:(?:^|.*;\s*)jVimVideo\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	    if (video !== 'undefined') {
	      video = video;
	    } else {
	      video = 59777392;
	    }
	  }
	  return video;
	}

}

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//
//  App Scripts
//

// Grab elements we need from our index.html
const videoTitle = document.getElementById('video-title');
const videoDescription = document.getElementById('video-description');
const descriptionCard = document.getElementById('description');
const descriptionButton = document.querySelector('.video-description-container button');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.querySelector('#results-container ul');
const searchButton = document.querySelector('.fa-search');
const videoOverlay = document.getElementById('video-over');
const dismissOverlay = document.querySelector('#video-over button');


// establish a global object for our app
JvimData = {
	seconds: utility.getCookieSeconds(),
	video: utility.getCookieVideo(),
	options: {
	  id: utility.getCookieVideo(),
	  loop: false,
		autoplay: true,
	}
};

// Create and embed the video iframe
const player = new Vimeo.Player('vimeo-slot', JvimData.options);

// update global object for seconds watched
player.on('timeupdate', (data) => {
  JvimData.seconds = data.seconds;
})

// alert when video is finished
player.on('ended', () => {
	JvimData.seconds = 0;
	utility.setCookie('jVimSeconds', JvimData.seconds);
  videoOverlay.classList.add('finished');
});

// set the video position
const setVimeoPosition = (seconds) => {
  player.setCurrentTime(seconds).then( (s) => {

  }).catch( (error) => {
    switch (error.name) {
      case 'RangeError':
        console.error(error);
        break;

      default:
        console.error(error);
        break;
    }
  });
}

// Initial load of player for first visit or refreshes
const loadPlayer = async (options) => {
	const video = await getVideoInfo(JvimData.options.id);
	utility.setCookie('jVimVideo', JvimData.options.id);
		if (video.data) {
			videoTitle.innerText = video.data.name;
			videoDescription.innerText = video.data.description;
			//update video to cookie time if exists
			let currentVidTime = utility.getCookieSeconds();
			setVimeoPosition(currentVidTime);
		} else {
			// handle error
		}
}


//
//  VIMEO API CALL FUNCTIONS
//

const getVideoInfo = async (id) => {
  try {
    return await axios.get(`api/videos/${id}`)
  } catch (error) {
    console.error(error)
  }
}

const displayVideo = async (id) => {
	videoOverlay.classList.remove('finished');
  const video = await getVideoInfo(id);

  if (video.data) {
		JvimData.video = id;
		utility.setCookie('jVimVideo', JvimData.video);

    player.loadVideo(id).then(function(id) {
      videoTitle.innerText = video.data.name;
      videoDescription.innerText = video.data.description;

    }).catch(function(error) {
      switch(error.name) {
          case 'TypeError':
            console.error(error);
            break;

          case 'Password Error':
            console.error(error);
            break;

          case 'PrivacyError':
            // the video is password-protected or private
            console.error(error);
            break;

          default:
            // some other error occurred
            console.error(error);
            break;
      }
    });

  }
}

const getSearchedVideos = async (query) => {
  try {
    return await axios.get(`api/search/${query}`)
  } catch (error) {
    console.error(error)
  }
}

const displaySearchedVideos = async (query) => {
  const searchResult = await getSearchedVideos(query);

  if (searchResult.data) {
    let videos = searchResult.data.data;
    let documentFragment = document.createDocumentFragment();
    resultsContainer.innerHTML = "";

    for (var i = 0; i < videos.length; i++) {

      let li = document.createElement('li');
      let textDiv = document.createElement('div');
			textDiv.setAttribute('class', 'title-container');

      let title = document.createElement('h3');
      title.innerText = videos[i].name;
			textDiv.appendChild(title);

			let videoId = (videos[i].uri).split('/');
			videoId = videoId[videoId.length-1]
			li.dataset.videoId = videoId;

			let imgContainer = document.createElement('div');
			imgContainer.setAttribute('class', 'video-thumb');

			let img = new Image();
			img.src = `https://i.vimeocdn.com/video/${videoId}_100x75.jpg?r=pad`;
			imgContainer.appendChild(img);

			li.appendChild(imgContainer);
      li.appendChild(textDiv);

      li.addEventListener('click', handleVideoClick);
      documentFragment.appendChild(li);
    }

    resultsContainer.appendChild(documentFragment);
  }
}



//
//	SEARCH BAR FUNCTIONS
//

const handleSearch = (e) => {
  if (e.target.value.length > 0) {
    displaySearchedVideos(e.target.value);
  }
}

const debouncedSearch = utility.debounce( (e) => {
  handleSearch(e);
}, 300);

//handle click on search result
const handleVideoClick = (e) => {
  let videoId = e.target.closest('li').dataset.videoId;
	//reset cookie time on new video
	JvimData.seconds = 0;
	utility.setCookie('jVimSeconds', JvimData.seconds);
	deactivateSearch();
  displayVideo(videoId);
}

const activateSearch = () => {
	searchInput.classList.toggle('active');
	searchInput.focus();
}

const deactivateSearch = () => {
	searchInput.classList.remove('active');
	searchInput.value = "";
	searchInput.blur();
}

const toggleSearch = () => {
	searchInput.classList.contains('active')
		? deactivateSearch()
		: activateSearch();
}


//
//  Event Listeners
//

searchButton.addEventListener('click', toggleSearch);
searchInput.addEventListener('keyup', (e) => debouncedSearch(e) );

dismissOverlay.addEventListener('click', () => {
	videoOverlay.classList.remove('finished');
});

// Window Listening for a load/refresh
window.addEventListener('load', (e) => {
	loadPlayer(JvimData.options);
  displaySearchedVideos('seattle')
});

//Listening for the browser window closing and set cookies
window.addEventListener('beforeunload', (e) => {
  e.preventDefault();
	utility.setCookie('jVimVideo', JvimData.video);
	utility.setCookie('jVimSeconds', JvimData.seconds);
});

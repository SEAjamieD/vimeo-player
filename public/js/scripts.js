alert(document.cookie);
JvimData = {};

let options = {
  id: 59777392,
  width: 460,
  loop: false
};

const player = new Vimeo.Player('vimeo-slot', options);

player.on('timeupdate', (data) => {
  JvimData.position = `${Math.round(data.percent * 100)}`; //store percentage in window object
  JvimData.seconds = data.seconds;
})

player.on('ended', () => {
  console.log('video ended - update this to an alert of some sort');
});

const setVimeoPosition = (seconds) => {
  player.setCurrentTime(seconds).then( (s) => {

  }).catch( (error) => {
    switch (error.name) {
      case 'RangeError':
      break;

      default:
      // console.error(error);
      break;
    }
  });
}

//Listening for the browser window closing and set cookie 14 expiring in 14 days
window.addEventListener('beforeunload', (e) => {
  e.preventDefault();
  let today = new Date();
  let twoWeeks = new Date(Date.now() + 12096e5);
  twoWeeks = twoWeeks.toUTCString();
  document.cookie = `jVimSeconds=${JvimData.seconds}; expires=${twoWeeks}`;
});

//Check for existing time set cookie and set the player to that time
const getCookieSeconds = () => {

  if ( document.cookie.split(';').filter((item) => item.includes('jVimSeconds=')).length ) {
    let seconds = document.cookie.replace(/(?:(?:^|.*;\s*)jVimSeconds\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    seconds !== undefined
    ? setVimeoPosition(seconds)
    : '';
  }
  
}

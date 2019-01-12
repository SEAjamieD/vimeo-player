// alert(document.cookie);
window.jVimData = {};

let options = {
  id: 59777392,
  width: 460,
  loop: false
};

const player = new Vimeo.Player('vimeo-slot', options);

player.on('play', () => {
  console.log('video playing');
});

player.on('pause', () => {
  console.log('paused');
});

player.on('timeupdate', (data) => {
  jVimData.position = `${Math.round(data.percent * 100)}`; //store percentage in window object
  jVimData.seconds = data.seconds;
})

player.on('ended', () => {
  console.log('video ended');
});

//Listening for the browser window closing
window.addEventListener('beforeunload', (e) => {
  e.preventDefault();
  document.cookie = `jVimSeconds=${jVimData.seconds}`;
});

//Check for existing time set cookie and set the player to that time
if ( document.cookie.split(';').filter((item) => item.includes('jVimSeconds=')).length ) {
  let seconds = document.cookie.replace(/(?:(?:^|.*;\s*)jVimSeconds\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  player.setCurrentTime(`${seconds}`).then( (s) => {

  }).catch( (error) => {
    switch (error.name) {
      case 'RangeError':
      break;

      default:
      console.error(error);
      break;
    }
  });

}

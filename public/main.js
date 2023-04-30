var quest = document.getElementsByClassName("quest")
var rest = document.getElementsByClassName("rest");
var trash = document.getElementsByClassName("delete");

var GuildBoard = [
  "Help a farmer repair his broken fence so his sheep won't escape.",
  "Deliver a basket of fresh eggs to the local bakery for the baker to use in his recipes.",
  "Assist a young boy in finding his lost kitten in the town square.",
  "Help an elderly woman carry her groceries back to her house.",
  "Participate in a town festival by competing in a friendly game of archery.",
  "Solve a local mystery by gathering clues and interviewing suspects.",
  "Help a struggling family in need by donating food and supplies.",
  "Teach a group of children how to read and write at the local school.",
  "Clean up the town's river by removing trash and debris.",
  "Join a group of volunteers in planting new trees in the town park."
];
var Adventures = [
  "Retrieve the legendary sword of light from the depths of the cursed forest.",
  "Explore the ruins of the ancient city and find the long-lost magical artifact that could save the kingdom from destruction.",
  "Brave the treacherous mountain pass and recover the precious gemstones that were stolen from the dwarven mines.",
  "Travel to the elven kingdom and negotiate a peace treaty between the warring factions.",
  "Slay the dragon that has been terrorizing the nearby towns and villages, and retrieve its hoard of treasure.",
  "Find the lost prince who disappeared during a battle and return him safely to the throne.",
  "Investigate the mysterious disappearance of the powerful wizard who has been missing for years.",
  "Retrieve the enchanted flower from the top of the tallest tower, which is guarded by a powerful sorceress.",
  "Escort a group of refugees to safety through the dangerous and haunted forest.",
  "Infiltrate the fortress of the evil sorcerer and steal the book of forbidden spells before he can unleash his dark magic on the world."
];

Array.from(quest).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const hero = this.parentNode.parentNode.childNodes[3].innerText
    const exp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    const HP = parseFloat(this.parentNode.parentNode.childNodes[7].innerText)
    const completed = document.querySelector('.completedQuest')
    console.log(name,hero,exp,HP)
    fetch('clickerQuest', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'hero': hero,
        'exp': exp,
        'HP' : HP
      })
    })
    .then(response => {
      if (response.ok){
        if(HP <= 0 ){
          alert(`Amidst a great struggle, our hero's journey has come to an end`)
        }else if(Math.random() > .5){
        alert(`You decide to venture out and : ${Adventures[Math.floor(Math.random()*10)]}`)}
        else if(Math.random() <= .5){
          alert(`The adventurer's guild has requested that you : ${GuildBoard[Math.floor(Math.random()*10)]}`)
        }
         return response.json()}
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});



Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const hero = this.parentNode.parentNode.childNodes[3].innerText
        fetch('clickerQuest', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'hero': hero
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});


Array.from(rest).forEach(function(element) {
  element.addEventListener('click', function (){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const hero = this.parentNode.parentNode.childNodes[3].innerText
    const HP = parseFloat(this.parentNode.parentNode.childNodes[11].innerText)
    fetch('clickerQuest/HP', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'hero': hero,
        'HP':HP
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});


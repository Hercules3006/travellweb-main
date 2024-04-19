document.getElementById("saveButton").addEventListener("click", function () {
    saveTextAsFile();
});
 
  // Function to save the text as a file
function saveTextAsFile() {

  user = JSON.parse(localStorage.getItem("user"));
  if(user == null){
    alert("You need to login to save blog");
    return;
  }

  // Get the content from the text box
  let title = document.getElementById("title").innerHTML;
  let content = document.getElementById("textBox").innerHTML;

  if(title == "") {
    alert("Title is empty");
    return;
  }
  if(content == "") {
    alert("Content is empty");
    return;
  }

  let listImage = content.match(/<img src="([^"]+)"/);

  let image = "";
  if(listImage == null || listImage.length == 0) image="../image/about-banner.jpg";
  else{
    if(listImage[0].includes("<img src=")){
      listImage[0] = listImage[0].replace("<img src=", "");
    }
    image = listImage[0].replace('"', "");
  }

  blog = {
    title: title,
    content: content,
    image: image,
    authorId: user._id,
  }
  postMethods("/blogs/create", blog).then(rs => {
    if(rs.status == 200) {
      alert("Save blog successfully")
      window.location.href = "blog.html";
    }
    else
      alert("Save blog failed");
  });

}

// Formatting functions
function formatDoc(command, value) {
  document.execCommand(command, false, value);
}

// Function to clear the content of the textBox element
function cleanContent() {
  var textBoxElement = document.getElementById("textBox");
  textBoxElement.innerHTML = "";
  alert("Content cleared successfully!");
}


contentEle = document.getElementById("textBox");

let isCorner = false;
let ImgPosition = {x: 0, y: 0};
let isResize = false;
let target = null;
let isEnter = false;
let targetEnter = null;
let isMove = false;
let offset = {x: 0, y: 0};
let parentPosition = {x: 0, y: 0};

const addImage = () => {
  const url = prompt("Enter the image URL");

  if (url) {
    xml = `
    <img src="${url}" alt="image" class="resize-drag" style="width: 100%; height: auto;"/>
    `
    contentEle.innerHTML += xml;
    document.getElementsByClassName("resize-drag")[0].draggable="false"
    document.getElementsByClassName("resize-drag")[0].addEventListener("mousemove", (event) => {
      var rect = event.target.getBoundingClientRect();
      if((event.offsetX <= 10 && event.offsetY <= 10) || (event.offsetX <= 10 && event.offsetY > rect.height - 10) || (event.offsetX > rect.width - 10 && event.offsetY <= 10) || (event.offsetX >= rect.width - 10 && event.offsetY >= rect.height - 10)){
        event.target.style.cursor = "move";
        isCorner = true;
      }
      else{
        event.target.style.cursor = "auto";
        isCorner = false;
      }
    });
    document.getElementsByClassName("resize-drag")[0].addEventListener("mousedown", (event) => {
      if(isCorner){
        target = event.target;
        let rect = event.target.getBoundingClientRect();
        isResize = true;
        ImgPosition.x = rect.left;
        ImgPosition.y = rect.top;
      }
      if(isEnter){
        target = event.target;
        isMove = true;
        let rect = event.target.getBoundingClientRect();
        offset.x = event.clientX - rect.left;
        offset.y = event.clientY - rect.top;
        parentPosition.x = contentEle.getBoundingClientRect().left;
        parentPosition.y = contentEle.getBoundingClientRect().top;
      }
    });
    document.getElementsByClassName("resize-drag")[0].addEventListener("mouseenter", (event) => {
      isEnter = true;
    });
    document.getElementsByClassName("resize-drag")[0].addEventListener("mouseleave", (event) => {
      isEnter = false;
    });
  }
};

document.body.addEventListener("mousemove", (event) => {
  if(isResize){
    let dx = event.clientX - ImgPosition.x;
    let dy = event.clientY - ImgPosition.y;
    if(dx > 60) target.style.width = dx + "px";
    if(dy > 100) target.style.height = dy + "px";
  }
  else if(isMove){
    target.style.position = "relative";
    target.style.left =  event.clientX - parentPosition.x - offset.x + "px";
    target.style.top = event.clientY - parentPosition.y -offset.y + "px";
  }
});

document.body.addEventListener("mouseup", (event) => {
  isResize = false;
  isMove = false;
});

document.body.addEventListener("mouseleave", (event) => {
  isResize = false;
  isMove = false;
});


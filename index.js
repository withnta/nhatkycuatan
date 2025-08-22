window.onload = function() {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  let postsDiv = document.getElementById("posts");

  if (posts.length === 0) {
    postsDiv.innerHTML = "<p>Chưa có bài viết nào 🌱</p>";
    return;
  }

  posts.forEach(post => {
    let div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <p><b>${post.date}</b></p>
      <p>${post.text}</p>
      ${post.image ? `<img src="${post.image}">` : ""}
    `;

    postsDiv.appendChild(div);
  });
};

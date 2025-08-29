// Hiển thị bài viết ở trang chính
window.onload = async function() {
  let postsDiv = document.getElementById("posts");
  let posts = await getPosts();

  if (posts.length === 0) {
    postsDiv.innerHTML = "<p>Chưa có bài viết nào 🌱</p>";
    return;
  }

  posts.forEach(post => {
    let div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <p>${post.text}</p>
      ${post.image ? `<img src="${post.image}">` : ""}
    `;
    postsDiv.appendChild(div);
  });
};

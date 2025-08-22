function postDiary() {
  let content = document.getElementById("content").value;
  let imageInput = document.getElementById("imageInput").files[0];

  if (!content && !imageInput) {
    alert("Vui lòng viết gì đó hoặc chọn ảnh!");
    return;
  }

  let reader = new FileReader();
  reader.onload = function (e) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.unshift({
      text: content,
      image: e.target.result || null,
      date: new Date().toLocaleString()
    });
    localStorage.setItem("posts", JSON.stringify(posts));
    alert("Đăng thành công!");
    renderPosts();
  };

  if (imageInput) {
    reader.readAsDataURL(imageInput);
  } else {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.unshift({
      text: content,
      image: null,
      date: new Date().toLocaleString()
    });
    localStorage.setItem("posts", JSON.stringify(posts));
    alert("Đăng thành công!");
    renderPosts();
  }

  // Reset form
  document.getElementById("content").value = "";
  document.getElementById("imageInput").value = "";
}

// Hàm hiển thị & quản lý bài viết
function renderPosts() {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  let container = document.getElementById("managePosts");

  if (posts.length === 0) {
    container.innerHTML = "<p>Chưa có bài viết nào 🌱</p>";
    return;
  }

  container.innerHTML = "";
  posts.forEach((post, index) => {
    let div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <p><b>${post.date}</b></p>
      <p>${post.text}</p>
      ${post.image ? `<img src="${post.image}">` : ""}
      <br>
      <button onclick="deletePost(${index})">❌ Xóa</button>
    `;

    container.appendChild(div);
  });
}

// Hàm xóa bài viết
function deletePost(index) {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  if (confirm("Bạn có chắc muốn xóa bài này không?")) {
    posts.splice(index, 1);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  }
}

// Gọi khi load trang để hiển thị sẵn
window.onload = renderPosts;

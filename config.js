// ⚡ config.js
const API_KEY = "$2a$10$dAvdg1raFJw4BYOlcjbPQ.FiWtB.HHY5urEV/RR5zqQgNuQO2gE12";   // Key JSONBin
const BIN_ID = "68b1c417d0ea881f406a53ff";     // Bin ID JSONBin
const BASE_URL = "https://api.jsonbin.io/v3/b/";

// Thêm API Key ImgBB
const IMGBB_KEY = "aeca5a388af492ab00bd2672a53546aa";   // Lấy tại https://api.imgbb.com/

// Hàm lấy bài viết
async function getPosts() {
  let res = await fetch(`${BASE_URL}${BIN_ID}/latest`, {
    headers: { "X-Master-Key": API_KEY }
  });
  let data = await res.json();
  return data.record.posts || [];
}

// Hàm lưu bài viết
async function savePosts(posts) {
  await fetch(`${BASE_URL}${BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify({ posts })
  });
}

(function () {
  const titleEl = document.getElementById("noteTitle");
  const metaEl = document.getElementById("noteMeta");
  const contentEl = document.getElementById("markdownContent");

  if (!titleEl || !metaEl || !contentEl) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const file = params.get("file") || "";
  const title = params.get("title") || "未命名笔记";
  const safePath = file.startsWith("notes/") && file.endsWith(".md");

  if (!safePath) {
    titleEl.textContent = "链接参数无效";
    metaEl.textContent = "请从笔记索引页进入。";
    contentEl.innerHTML = "<p>无法读取笔记。参数 file 必须是 notes/ 目录下的 .md 文件。</p>";
    return;
  }

  titleEl.textContent = title;
  metaEl.textContent = "来源文件：" + file;

  fetch(file)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      return response.text();
    })
    .then(function (markdown) {
      if (!window.marked || !window.DOMPurify) {
        throw new Error("渲染组件加载失败");
      }

      marked.setOptions({
        gfm: true,
        breaks: true,
        mangle: false,
        headerIds: true
      });

      const html = marked.parse(markdown);
      const cleanedHtml = DOMPurify.sanitize(html);
      contentEl.innerHTML = cleanedHtml;
      document.title = title + " | 学习笔记";
    })
    .catch(function (error) {
      titleEl.textContent = "加载失败";
      metaEl.textContent = "请检查文件路径或文件名。";
      contentEl.innerHTML = "<p>无法打开该笔记：" + error.message + "</p>";
    });
})();

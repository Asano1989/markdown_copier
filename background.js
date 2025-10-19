// 拡張機能がインストールされたとき（または更新・ブラウザ起動時など）に実行される
chrome.runtime.onInstalled.addListener(() => {
  // コンテキストメニュー（右クリックメニュー）を作成
  chrome.contextMenus.create({
    id: "copyAsMarkdownLink", // メニューを識別するためのユニークなID
    title: "Markdown形式でコピー", // メニューに表示されるテキスト
    contexts: ["page"] // どの場所で右クリックしたときに表示するか（"page"はページ全体）
  });
});

// コンテキストメニューがクリックされたときに実行される
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // クリックされたメニューのIDが、私たちが作成したものか確認
  if (info.menuItemId === "copyAsMarkdownLink") {
    // 1. 必要な情報を取得
    const pageTitle = tab.title; // 現在のタブのタイトル
    const pageUrl = tab.url;     // 現在のタブのURL

    // 2. Markdown形式に整形
    // 形式: [当該ページのtitle](当該ページのURL)
    const markdownText = `[${pageTitle}](${pageUrl})`;

    // 3. クリップボードにコピー
    // ChromeのScripting APIを使って、クリップボードに書き込む関数を実行
    // Chromeのサービスワーカー（background.js）から直接クリップボードにアクセスする代わりに、
    // ActiveTabの権限を使って、コンテンツスクリプトを経由せずに実行できる新しい方法です。
    chrome.scripting.executeScript({
      target: { tabId: tab.id }, // 現在のタブを対象にする
      func: copyToClipboard, // 実行したい関数
      args: [markdownText] // 実行したい関数に渡す引数
    });
  }
});

// executeScriptで対象のタブで実行される関数（この関数はクリップボード操作のためだけに定義）
function copyToClipboard(text) {
  // クリップボードAPIを使ってテキストを書き込む
  navigator.clipboard.writeText(text)
    .then(() => {
      // 成功した場合（コンソールに表示されるので、テストに役立つ）
      console.log('Markdown link copied to clipboard successfully!');
    })
    .catch(err => {
      // 失敗した場合
      console.error('Failed to copy text: ', err);
    });
}

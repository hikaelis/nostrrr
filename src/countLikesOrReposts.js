const { relayInit, finishEvent } = require('nostr-tools');
require("websocket-polyfill");

/**
 *投稿のいいね数またはリポスト数をカウントする
 * @param {string} targetPostId
 * @param {string} targetPubKey
 * @param {number} kind - 'like'または'repost'
 * @return {number} 
 */
const countLikesOrReposts = async(targetPostId, targetPubKey, kind) => {
  // 各種変数
  let kindNum = kind === 'like' ? 7 : kind === 'repost' ? 6 : null;
  if (!kindNum) throw new Error('Invalid kind specified. Choose "like" or "repost".');
  let count = 0;

  // リレーへの接続
  const relayURL = 'wss://yabu.me'
  const relay = relayInit(relayURL)
  relay.on('connect', () => {
    console.log(`connected to ${relay.url}`)
  })
  relay.on('error', () => {
    console.log(`failed to connect to ${relay.url}`)
  })
  await relay.connect()

  // イベントの取得
  const sub = relay.sub([{ kinds: [kindNum], authors: [] }]);

  // イベントの取得とカウント
  await new Promise((resolve, reject) => {
    sub.on("event", (ev) => {
      const eTag = ev.tags.find(tag => tag[0] == 'e');
      if (eTag[eTag.length-1] == targetPostId){
        count++;
      }
    })
    setTimeout(() => {
      resolve();
    }, 10000)
  })
  console.log(`Total like count for post ${targetPostId}: ${count}`);
  return count;
}

countLikesOrReposts('48acc96d02b304641595f90c4136c4136455ee407a2cceba4fc7d29eadd98712', '85e721cb28624353df3d7562044055aa6bc4a6d478735c03d134a89c6db5011a', 'like')
  .then(count => console.log(`Count: ${count}`))
  .catch(error => console.error(error))
// process.exit(0);

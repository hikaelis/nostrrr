const { relayInit, finishEvent } = require('nostr-tools');
require("websocket-polyfill");

/**
 *投稿のいいね数またはリポスト数をカウントする
 * @param {string} targetPostId
 * @param {string} targetPubKey
 * @param {string} kind - 'like'または'repost'
 * @return {number} 
 */
const _countLikesOrReposts = async(targetPostId, targetPubKey, kind) => {
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
  sub.on("event", (ev) => {
      console.log(ev)
      const eTag = ev.tags.find(tag => tag[0] == "e");
      if (eTag[1] == targetPostId){
        // console.log('find!')
        count++;
      }
    })
  console.log(`Total like count for post ${targetPostId}: ${count}`);
  return count;
}

_countLikesOrReposts('15a67de0db4ac2062499fbe4fcab5134f8f93b481c7e82a8b09fad5ca7607e91', '85e721cb28624353df3d7562044055aa6bc4a6d478735c03d134a89c6db5011a', 'like')
  .then(count => console.log(`Count: ${count}`))
  .catch(error => console.error(error))
//process.exit(0);

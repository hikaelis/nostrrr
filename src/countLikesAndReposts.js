const { eventKind, NostrFetcher } = require("nostr-fetch")
require("websocket-polyfill");


/**
 *投稿のいいね数またはリポスト数をカウントする
 * @param {string} targetPostId
 * @param {string} targetPubKey
 * @return {number} 
 */
const countLikesAndReposts = async(targetPostId, targetPubKey) => {
  // 何時間前までイベント取得するか
  const nHoursAgo = (hrs) =>
  Math.floor((Date.now() - hrs * 60 * 60 * 1000) / 1000);
  // リレーの設定
  const fetcher = NostrFetcher.init();
  const relayUrls = ["wss://yabu.me"];

  let count = 0;
  // イベントの取得
  const postIter = fetcher.allEventsIterator(
    relayUrls, 
    /* filter (kinds, authors, ids, tags) */
    { kinds: [ eventKind.reaction, eventKind.repost ] },
    /* time range filter (since, until) */
    { since: nHoursAgo(720) },
    /* fetch options (optional) */
    { skipVerification: true }
  );
  // 対象の投稿idに対するイベントがあったらcount++
  for await (const ev of postIter){
    try{
        // console.log(ev.content)
      const eTag = ev.tags.find(tag => tag[0] == "e")
      const pTag = ev.tags.find(tag => tag[0] == "p")
      // console.log(eTag)
      if (eTag[1] == targetPostId && pTag[1] == targetPubKey){
        // console.log('find!')
        count++;
      }
    }
    catch{
      // pass
    }
    
  }
  return count;
}

const targetPostId = "15a67de0db4ac2062499fbe4fcab5134f8f93b481c7e82a8b09fad5ca7607e91";
const targetPubKey = "85e721cb28624353df3d7562044055aa6bc4a6d478735c03d134a89c6db5011a"
countLikesAndReposts(targetPostId, targetPubKey)
.then(count => {
  console.log(count);
  process.exit(0);
})
.catch(err => {
  console.error(err)
  process.exit(0);
});


module.exports = { countLikesAndReposts }
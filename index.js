const { eventKind, NostrFetcher } = require("nostr-fetch")
const lodash = require('lodash');
require("websocket-polyfill");
const { GetPostsPerAuthor } = require("./src/fetchAllPosts")
const { countLikesAndReposts } = require("./src/countLikesAndReposts")


const main = async (targetPubKey) => {
  // 投稿を全取得
  const postsPerAuthor = await GetPostsPerAuthor(targetPubKey);
  
  // ランキング用辞書
  let ranking = {};
  const promises = [];
  for await (const { author, events } of postsPerAuthor){
    for (const ev of events){
      const targetPostId = ev.id
      const promise = countLikesAndReposts(targetPostId, targetPubKey)
      .then(count => {
        ranking[targetPostId] = count
        console.log(ranking)
      })
      .catch(err => {
        console.error(err)
      });
      promises.push(promise);
    }
  }
  await Promise.all(promises);
  // rankingをsort
  ranking_sorted = lodash.fromPairs(lodash.sortBy(lodash.toPairs(ranking), ([key, value]) => -value));

  return ranking_sorted
}

const targetPubKey = "85e721cb28624353df3d7562044055aa6bc4a6d478735c03d134a89c6db5011a"
main(targetPubKey)
.then(ranking_sorted => {console.log(ranking_sorted)})
.catch(err => {console.log(err)})
//console.log(ranking_sorted)
const { eventKind, NostrFetcher } = require("nostr-fetch")
require("websocket-polyfill");

/**
 * 
 * @param {*} targetPubKey 
 */
const GetPostsPerAuthor = async(targetPubKey) => {
  // リレーの設定
  const fetcher = NostrFetcher.init();
  const relayUrls = ["wss://yabu.me"];

  const postsPerAuthor = fetcher.fetchLatestEventsPerAuthor(
    /* authors and relay set */
    // you can also pass a `Map` which has mappings from authors (pubkey) to reley sets,
    // to specify a relay set for each author
    { 
        authors: [targetPubKey],
        relayUrls,
    },
    /* filter */
    { kinds: [ eventKind.text ] },
    /* number of events to fetch for each author */
    1000,
  );
  
  // for await (const { author, events } of postsPerAuthor) {
  //   console.log(`posts from ${author}:`);
  //   for (const ev of events) {
  //       console.log(ev.content);
  //   }
  // }

  return postsPerAuthor
}

const targetPubKey = "85e721cb28624353df3d7562044055aa6bc4a6d478735c03d134a89c6db5011a"
const postsPerAuthor = GetPostsPerAuthor(targetPubKey);

module.exports = { GetPostsPerAuthor }
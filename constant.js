const constants = {
  apiUrl: 'https://dev.editor.video.wiki',
  url: 'https://videowiki.pt',
  backImageUrl: 'https://api.cast.video.wiki/api/photos/?category=',
  apiCastUrl: 'https://dev.api.cast.video.wiki',
  streamUrl: 'https://play.stream.video.wiki/live/',
  eventDetailsUrl:
    'https://dev.api.cast.video.wiki/api/event/meeting/info/?public_meeting_id=',
  redirect_uri: 'https://dev.stream.video.wiki/callback/',
  client_id: '034ec543-fb7c-4e13-93f7-55af40f1ce4d',
  client_secret: 'GXkQhkjxsijknM.yz8-2BJmKM.',
  hydra_ep: 'https://openid.video.wiki',
  hydra_lg: 'https://login.video.wiki',
  challengeUri:
    'https://login.video.wiki/oauth2/auth?audience=&max_age=0&prompt=&redirect_uri=https://dev.stream.video.wiki/callback/&response_type=code&scope=openid+offline+offline_access&client_id=034ec543-fb7c-4e13-93f7-55af40f1ce4d&nonce=hognfveoohhddoralbeygsjg&state=imnweycejbfpyrmnahgqzcmm',
  tokenUrl: '',
  moralisServerUrl: 'https://y4ur2a7c7uaq.usemoralis.com:2053/server',
  moralisAppID: 'wg33vantNddEU1H2dlhxSgJ0Z1NRudbjIvr0Jzc4',
  profilingUrl: 'https://openid.video.wiki',
  apiKey: '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',
};
if (process.env.NODE_ENV === 'production') {
  constants.challengeUri =
    'https://login.video.wiki/oauth2/auth?audience=&max_age=0&prompt=&redirect_uri=https://dev.stream.video.wiki/callback/&response_type=code&scope=openid+offline+offline_access&client_id=034ec543-fb7c-4e13-93f7-55af40f1ce4d&nonce=hognfveoohhddoralbeygsjg&state=imnweycejbfpyrmnahgqzcmm';
  constants.client_id = '034ec543-fb7c-4e13-93f7-55af40f1ce4d';
  constants.client_secret = 'GXkQhkjxsijknM.yz8-2BJmKM.';
  constants.redirect_uri = 'https://dev.stream.video.wiki/callback/';
}

export default constants;

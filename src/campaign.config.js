export const campaignConfig = {
  currentCampaign : "Dry Run",
  //used to generate the `campaign` URL parameter for proposal links e.g. `?campaign=Dry%20Run`
  //Also please use the variable to render the word "Dry Run" on the homepage so that I can see how to use that variable
  currentCampaignStartBlock: 11588550,
  currentCampaignEndBlock: 11682300,
  //These variables will be used to calculate Time Left to Submit Meme per WFM-93
  includedCampaignDropdowns : [
    "Dry Run"
  ],
  isTest: false, //when true, this parameter a) adds parameter `isTest=true` to links uploaded, and b) displays memes whose `isTest` paramter is true. When false, this parameter c) removes the `isTest=true` parameter when submitting links and d) filters out all memes with `isTest=true` parameter ,
  prizeThresholds: [{
    threshold : 21,
    prize : 5
  } , {
    threshold: 34,
    prize : 8,
  } , {
    threshold : -1, // maximum
    prize : 13,
  }],
};

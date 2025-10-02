import { AdMob, RewardAdPluginEvents, AdMobRewardItem } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

const AD_UNIT_ID = 'ca-app-pub-1494865781139465/9403812026';

export const initializeAdMob = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('AdMob only works on native platforms');
    return;
  }

  try {
    await AdMob.initialize({
      initializeForTesting: false,
    });
    console.log('AdMob initialized successfully');
  } catch (error) {
    console.error('Failed to initialize AdMob:', error);
  }
};

export const showRewardAd = async (
  onRewarded: (item: AdMobRewardItem) => void,
  onFailed: () => void
): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Running in browser - simulating ad reward');
    // Simulate ad watching in browser for testing
    setTimeout(() => {
      onRewarded({ type: 'test', amount: 1 });
    }, 2000);
    return;
  }

  try {
    // Add event listeners
    await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
      console.log('User earned reward:', reward);
      onRewarded(reward);
    });

    await AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error) => {
      console.error('Failed to load reward ad:', error);
      onFailed();
    });

    await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      console.log('Reward ad dismissed');
      // User closed ad without watching completely
      onFailed();
    });

    // Prepare the reward ad
    await AdMob.prepareRewardVideoAd({
      adId: AD_UNIT_ID,
    });

    // Show the reward ad
    await AdMob.showRewardVideoAd();
  } catch (error) {
    console.error('Error showing reward ad:', error);
    onFailed();
  }
};

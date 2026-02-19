import * as FeedBacks from 'expo-haptics';

export default function haptics() {
  
  const handleViber = {
    Light: async () => {
      await FeedBacks.impactAsync(FeedBacks.ImpactFeedbackStyle.Light);
    },
    Medium: async () => {
      await FeedBacks.impactAsync(FeedBacks.ImpactFeedbackStyle.Medium);
    },
    Strong: async () => {
      await FeedBacks.impactAsync(FeedBacks.ImpactFeedbackStyle.Strong);
    },
  }
  
  return {
    handleViber
  }
}
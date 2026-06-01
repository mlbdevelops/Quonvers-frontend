import * as Notifications from "expo-notifications";

export default async function PushNotif(title, body){
  const { status } = await Notifications.requestPermissionsAsync();
  if (status != 'granted') {
    await Notifications.requestPermission()
  }
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null,
  });
}
export default function shouldShowAvatar(current, next) {
  if (!next) return true;
  return current.sender_id !== next.sender_id;
}


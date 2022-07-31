import emoji from '../datas/emojis';

const getEmoji = (name: string) => {
  const emojiData = emoji.find((e) => e.name === name);

  return emojiData ? `<:${emojiData.guildId}:${emojiData.id}>` : null;
};

export default getEmoji;

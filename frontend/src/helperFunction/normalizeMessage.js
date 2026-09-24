

export const normalizeMessage = (message) => {
  
  if (!message) return null;

  let attachments = message.attachments || [];

  
  if (!Array.isArray(attachments)) {
    attachments = attachments ? [attachments] : [];
  }

  return {
    ...message,
    attachments,
  };
};

export const normalizeMessages = (messages = []) => {
  return messages
    .map(normalizeMessage)
    .filter(Boolean);
};
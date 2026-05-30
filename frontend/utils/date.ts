export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
